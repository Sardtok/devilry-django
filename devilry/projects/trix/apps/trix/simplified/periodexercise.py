from trix.apps.trix.models import PeriodExercise
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi

@simplified_modelapi
class SimplifiedPeriodExercise(object):
    """ Simplified wrapper for :class:`trix.apps.trix.models.PeriodExercise`. """
    class Meta(object):
        model = PeriodExercise
        resultfields = FieldSpec('id',
                                 'period',
                                 'exercise',
                                 'points',
                                 'starred',
                                 )
        searchfields = FieldSpec('period__short_name',
                                 'period__long_name',
                                 'exercise__short_name',
                                 'exercise__long_name',
                                 'exercise__topics__name')
        methods = ['read', 'search']
