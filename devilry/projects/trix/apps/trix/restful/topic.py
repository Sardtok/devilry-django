from devilry.apps.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from ...simplified import SimplifiedTopic

@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedTopic(ModelRestfulView):
    class Meta:
        simplified = SimplifiedTopic

    class ExtjsModelMeta:
        combobox_displayfield = 'name'
        combobox_tpl = ('<div class="important">{name}</div>')
