from devilry.apps.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from ...simplified import SimplifiedExercise

@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedExercise(ModelRestfulView):
    class Meta:
        simplified = SimplifiedExercise

    class ExtjsModelMeta:
        combobox_displayfield = 'short_name'
        combobox_tpl = ('<div class="important">{short_name}</div>'
                        '<div class="unimportant">{long_name}</div>')
