from trix.apps.trix.models import Exercise
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi

@simplified_modelapi
class SimplifiedExercise(object):
    """ Simplified wrapper for :class:`trix.apps.trix.models.Exercise`. """
    class Meta(object):
        model = Exercise
        resultfields = FieldSpec('id',
                                 'short_name',
                                 'long_name',
                                 'text',
                                 'points',
                                 'topics',
                                 'prerequisites',
                                 )
        searchfields = FieldSpec('short_name',
                                 'long_name')
        methods = ['read', 'search']
