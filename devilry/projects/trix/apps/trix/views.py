from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from decimal import *

from devilry.apps.core.models import Period
from models.status import Status
from models.exercisestatus import ExerciseStatus

def get_level(points=0):
    level = 1
    add = Decimal(10, 2)
    total = Decimal(add, 2)
    while points > total:
        print total, "(", add, ")"
        add *= Decimal(1.5)
        total += add
        level += 1
    return {'level': level,
            'next': add,
            'next_level': level+1,
            'points': points-(total-add),
            'total': total}

def get_points(user):
    points_total = 0;
    for stats in user.exercise_results.all():
        points_total += stats.exercise.points
    return points_total

def main(request):
    periods = [p for p in list(Period.objects.all()) if p.is_active()]
    exercises = {}
    exc_stats = {}
    student_periods = []
    points_total = 0

    for period in periods:

        try:
            if period.relatedstudents.get(user__id=request.user.id):
                student_periods.append(period.id)
                print "Student in period:", period.short_name
        except:
            print "Not a student in period:", period.short_name
            pass

        for student in period.relatedstudents.all():
            print student.user.username

        p_excs = period.exercises.all()
        if p_excs:
            add = {}
            for exc in p_excs:
                e = {'title': exc.exercise.long_name,
                     'text': exc.exercise.text, 'status': -1}

                if request.user.is_authenticated():
                    try:
                        stats = exc.student_results.get(student=request.user)
                        points_total += stats.status.percentage * exc.points
                        e.update([['status', stats.status.id]]);
                    except ExerciseStatus.DoesNotExist, exception:
                        pass
                add.update( [[exc.id, e]] )
            exercises.update([[period, add]])

    statuses = []
    if request.user.is_authenticated():
        statuses = Status.objects.filter(active=True)

    return render(request,'trix/main.django.html',
                  {'exercises': exercises,
                   'exc_stats': exc_stats,
                   'statuses': statuses,
                   'student_periods': student_periods,
                   'points': points_total,
                   'level_info': get_level(points_total)})
#                  {'exercises': Period.objects.all().exercises.all()})

def profile(request):
    points = get_points(request.user)
    return render(request, 'trix/profile.django.html',
                  {'points': points,
                   'level': get_level(points),})