from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from devilry.apps.core.models import Period
from models.status import Status
from models.exercisestatus import ExerciseStatus

def main(request):
    periods = [p for p in list(Period.objects.all()) if p.is_active()]
    exercises = {}
    exc_stats = {}
    student_periods = []

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
                        e.update([['status', stats.id]]);
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
                   'student_periods': student_periods})
#                  {'exercises': Period.objects.all().exercises.all()})

