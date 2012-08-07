from devilry.restful import restful_api, RestfulView, RestfulManager
from devilry.restful.restview import extjswrap
from devilry.restful.serializers import SerializableResult, ErrorMsgSerializableResult

from django.db.models import Count, Sum
from django.http import HttpResponseBadRequest

from trix.apps.trix.models import Period, PeriodExercise, ExerciseStatus
from manager import trix_manager

@trix_manager.register
@restful_api
class RestfulPeriodStatistics(RestfulView):

    def process_period(self, period, user):
        p_data = {}
        p_data['id'] = period.id
        p_data['short_name'] = period.short_name
        p_data['long_name'] = period.long_name
        p_data['exercises'] = period.exercisecount
        if period.totalpoints is None:
            period.totalpoints = 0
        p_data['total_points'] = period.totalpoints
        p_data['starred'] = period.exercises.filter(starred=True).count()
        exercises = period.exercises.filter(student_results__student=user)
        results = ExerciseStatus.objects.filter(student=user, exercise__in=exercises)
        p_data['points'] = 0
        p_data['exercises_done'] = exercises.count()
        for result in results:
            p_data['points'] += int(result.exercise.points * result.status.percentage)
        exercises = exercises.filter(starred=True)
        p_data['starred_done'] = exercises.count()
        p_data['points_percent'] = int(p_data['points'] * 100 / p_data['total_points'])
        p_data['done_percent'] = int(p_data['exercises_done'] * 100 / p_data['exercises'])
        p_data['starred_percent'] = 0
        if p_data['starred'] > 0:
            int(p_data['starred_done'] * 100 / p_data['starred'])
        return p_data


    def crud_update(self, request, id):
        return ErrorMsgSerializableResult("Cannot change statistics.",
                                          httpresponsecls=HttpResponseBadRequest)

    def crud_delete(self, request, id):
        return ErrorMsgSerializableResult("Cannot delete statistics.",
                                          httpresponsecls=HttpResponseBadRequest)

    def crud_create(self, request):
        return ErrorMsgSerializableResult("Cannot create statistics.",
                                          httpresponsecls=HttpResponseBadRequest)

    def crud_read(self, request, id):
        period = Period.objects.annotate(exercisecount=Count('exercises'), totalpoints=Sum('exercises__points')).get(id=id)
        data = [self.process_period(period, request.user)]
        result = extjswrap(data, True, total=1)
        return SerializableResult(result)

    def crud_search(self, request):
        start = 0
        limit = 25
        if 'getdata_in_qrystring' in request.GET:
            if 'start' in request.GET:
                start = request.GET['start']
            if 'limit' in request.GET:
                limit = request.GET['limit']
        
        periods = Period.objects.filter(exercises__isnull=False).annotate(exercisecount=Count('exercises'), totalpoints=Sum('exercises__points'))[start:start+limit]

        data = []
        for period in periods:
            p_data = self.process_period(period, request.user)
            data.append(p_data)

        result = extjswrap(data, True, total=len(data))
        return SerializableResult(result)
