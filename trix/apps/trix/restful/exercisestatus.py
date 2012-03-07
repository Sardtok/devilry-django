from devilry.restful import restful_modelapi, ModelRestfulView, RestfulManager
from devilry.apps.extjshelpers import extjs_restful_modelapi

from trix.apps.trix.simplified import SimplifiedExerciseStatus
from periodexercise import RestfulSimplifiedPeriodExercise
from status import RestfulSimplifiedStatus
from manager import trix_manager
from authorization import AuthorizationMixin

@trix_manager.register
@extjs_restful_modelapi
@restful_modelapi
class RestfulSimplifiedExerciseStatus(AuthorizationMixin):
    class Meta:
        simplified = SimplifiedExerciseStatus
        foreignkey_fields = {'exercise': RestfulSimplifiedPeriodExercise,
                             'status': RestfulSimplifiedStatus}

    class ExtjsModelMeta:
        combobox_displayfield = 'exercise__exercise__long_name'
        combobox_tpl = ('<div class="important">{exercise__exercise__long_name}</div>'
                        '<div class="unimportant">{status__name}</div>')
