from devilry.restful import restful_api, RestfulView, RestfulManager
from devilry.restful.restview import extjswrap
from devilry.restful.serializers import SerializableResult, ErrorMsgSerializableResult

from django.db.models import Count, Sum
from django.http import HttpResponseBadRequest

from trix.apps.trix.models import Topic, PeriodExercise, ExerciseStatus
from manager import trix_manager

@trix_manager.register
@restful_api
class RestfulTopicStatistics(RestfulView):

    def process_topic(self, topic, user):
        all_exc = topic.exercises.filter(periods__isnull=False)
        exercises = PeriodExercise.objects.filter(exercise__in=all_exc)
        t_data = {}
        t_data['id'] = topic.id
        t_data['name'] = topic.name
        t_data['exercises'] = topic.exercisecount
        if topic.totalpoints is None:
            topic.totalpoints = 0
        t_data['total_points'] = topic.totalpoints
        t_data['starred'] = exercises.filter(starred=True).count()
        exercises = exercises.filter(student_results__student=user)
        results = ExerciseStatus.objects.filter(student=user, exercise__in=exercises)
        t_data['points'] = 0
        t_data['exercises_done'] = exercises.count()
        for result in results:
            t_data['points'] += int(result.exercise.points * result.status.percentage)
        exercises = exercises.filter(starred=True)
        t_data['starred_done'] = exercises.count()
        return t_data


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
        topic = Topic.objects.annotate(exercisecount=Count('exercises__periods'), totalpoints=Sum('exercises__periods__points')).get(id=id)
        data = [self.process_topic(topic, request.user)]
        result = extjswrap(data, True, total=1)
        return SerializableResult(result)

    def crud_search(self, request):
        topics = Topic.objects.filter(exercises__isnull=False).filter(exercises__periods__isnull=False).annotate(exercisecount=Count('exercises__periods'), totalpoints=Sum('exercises__periods__points'))

        data = []
        for topic in topics:
            t_data = self.process_topic(topic, request.user)
            data.append(t_data)

        result = extjswrap(data, True, total=len(data))
        return SerializableResult(result)
