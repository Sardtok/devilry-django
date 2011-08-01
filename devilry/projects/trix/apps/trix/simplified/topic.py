from ...models import Topic
from devilry.simplified import FieldSpec, simplified_modelapi, SimplifiedModelApi

@simplified_modelapi
class SimplifiedTopic(object):
    """ Simplified wrapper for :class:`trix.apps.trix.models.Topic`. """
    class Meta(object):
        model = Topic
        resultfields = FieldSpec('id',
                                 'name',
                                 )
        searchfields = FieldSpec('name')
        methods = ['read', 'search']
