from trix.apps.trix.models import ExerciseStatus
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedExerciseStatus(AuthorizationMixin):
    """ Simplified wrapper for :class:`trix.apps.trix.models.ExerciseStatus`. """
    class Meta(object):
        model = ExerciseStatus
        resultfields = FieldSpec('id',
                                 'exercise',
                                 'status',
                                 'time_done',
                                 )
        searchfields = FieldSpec('student',
                                 'exercise')
        methods = ['read', 'search']
