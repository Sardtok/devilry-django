from trix.apps.trix.models import Exercise
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi
from authorization import AuthorizationMixin

@simplified_modelapi
class SimplifiedExercise(AuthorizationMixin):
    """ Simplified wrapper for :class:`trix.apps.trix.models.Exercise`. """
    class Meta(object):
        model = Exercise
        resultfields = FieldSpec('id',
                                 'short_name',
                                 'long_name',
                                 'text',
                                 'points',
                                 'topics__id',
                                 'prerequisites__id'
                                 )
        searchfields = FieldSpec('short_name',
                                 'long_name')

#       editablefields = ('id', 'short_name', 'long_name', 'text', 'points')
        fake_editablefields = ('fake_topics', 'fake_prerequisites')

        methods = ['create', 'read', 'update', 'delete', 'search']

    @classmethod
    def post_save(cls, user, obj):
        pass
