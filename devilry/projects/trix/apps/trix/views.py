from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from devilry.apps.core.models import Period
from models.status import Status
from models.exercisestatus import ExerciseStatus
from models.periodexercise import PeriodExercise

def get_level(points=0):
    level = 1
    add = 10
    total = add
    while points >= total:
        add = int(add * 1.5)
        total += add
        level += 1

    levelpoints = points-(total-add)

    return {'level': level,
            'next_level': level+1,
            'level_points': add,
            'total_next': total,
            'points_on_level': levelpoints,
            'points_needed': add-levelpoints,
            'total_points': points,
            'percentage': levelpoints * 100 / add}

def get_topic_points(topic, user):
    if not user.is_authenticated():
        return 0
    exercises = topic.exercises.all()
    stats = []
    for e in exercises:
        stats.extend(ExerciseStatus.objects.filter(student=user,
                                                        exercise__in=e.periods.all()))

    points = 0
    for stat in stats:
        points += int(stat.exercise.points * stat.status.percentage)
    return points
    
def get_points(user):
    if not user.is_authenticated():
        return 0
    points_total = 0;
    for stats in user.exercise_results.all():
        points_total += int(stats.exercise.points * stats.status.percentage)
    return points_total

def main(request):
    all_exercises = PeriodExercise.objects.filter(period__start_time__lte
                                                  =datetime.now(),
                                                  period__end_time__gte
                                                  =datetime.now())
    exercises = {}
    topics = {}
    prerequisites = {}
    for exercise in all_exercises:
        e = {'title': exercise.exercise.long_name,
             'text': exercise.exercise.text,
             'status': -1}

        ts = exercise.exercise.topics.exclude(id__in=topics.keys)
        for t in ts:
            topics.setdefault(t.id, t)

        ps = exercise.exercise.prerequisites.exclude(id__in=prerequisites.keys)
        for p in ps:
            prerequisites.setdefault(p.id, p)
        

        if request.user.is_authenticated():
            try:
                stats = exercise.student_results.get(student=request.user)
                e.update([['status', stats.status.id]])
            except ExerciseStatus.DoesNotExist:
                pass
        exercises.setdefault(exercise.period, {}).update([[exercise.id, e]])

    statuses = []
    if request.user.is_authenticated():
        statuses = Status.objects.filter(active=True)

    if topics:
        print "Testing points for topic (" + topics[3].name + ")"
        print get_topic_points(topics[3], request.user);

    return render(request,'trix/main.django.html',
                  {'exercises': exercises,
                   'statuses': statuses,
                   'topics': topics,
                   'prerequisites': prerequisites,
                   'level': get_level(get_points(request.user))})
#                  {'exercises': Period.objects.all().exercises.all()})

def get_portrait(level):
    #user should be able to choose the portrait type at some point. Currently only ifitar is available
    portrait_class = 'ifitar'
    image_type = 'png'
    if level > 10:
        return ''.join([portrait_class, '10', '.', image_type])

    return ''.join([portrait_class, (str(level)), '.', image_type])

@login_required
def profile(request):
    level = get_level(get_points(request.user))
    return render(request, 'trix/profile.django.html',
                  {'level': level,
                   'portrait': get_portrait(level['level'])})

@login_required
def exercisestatus(request, exercise=-1):
    exc = get_object_or_404(PeriodExercise, pk=exercise)
    
    status = None
    if request.POST['status'] != "-1":
        status = get_object_or_404(Status, pk=request.POST['status'])

    if status is not None and not status.active:
        raise Http404

    exc_status = None
    try:
        exc_status = exc.student_results.get(student=request.user)
    except ExerciseStatus.DoesNotExist:
        if status is not None:
            exc_status = ExerciseStatus(exercise=exc,
                                        student=request.user, status=status)

    if status is None:
        if exc_status is None:
            raise Http404
        exc_status.delete()
        points = get_level(get_points(request.user))
        return HttpResponse("-1, " + str(points['level']) + ", "
                            + str(points['percentage']) + ", "
                            + str(points['points_on_level']) + ", "
                            + str(points['level_points']) + ", "
                            + str(points['total_points']),
                            mimetype="text/plain")

    exc_status.status = status
    exc_status.full_clean()
    exc_status.save()
    points = get_level(get_points(request.user))
    return HttpResponse(str(exc_status.status.id) + ", "
                        + str(points['level']) + ", "
                        + str(points['percentage']) + ", "
                        + str(points['points_on_level']) + ", "
                        + str(points['level_points']) + ", "
                        + str(points['total_points']), mimetype="text/plain")
