from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi
from devilry.apps.student.restful import RestfulSimplifiedPeriod

from trix.apps.trix.simplified import SimplifiedPeriodExercise
from exercise import RestfulSimplifiedExercise
from manager import trix_manager

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedPeriodExercise(ModelRestfulView):
    class Meta:
        simplified = SimplifiedPeriodExercise
        foreignkey_fields = {'exercise': RestfulSimplifiedExercise,
                             'period': RestfulSimplifiedPeriod}

    class ExtjsModelMeta:
        combobox_displayfield = 'exercise__long_name'
        combobox_tpl = ('<div class="important">{exercise__short_name}</div>'
                        '<div class="unimportant">{exercise__long_name}</div>')

