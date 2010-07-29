from django import forms
from devilry.addons.examiner.feedback_view import view_shortcut
from models import RstSchemaGrade

class RstSchemaGradeForm(forms.ModelForm):
    class Meta:
        model = RstSchemaGrade
        fields = ('schema',)
        widgets = {
            'schema': forms.Textarea(attrs={'rows':40, 'cols':70})
        }

def view(request, delivery_obj):
    return view_shortcut(request, delivery_obj, RstSchemaGrade,
            RstSchemaGradeForm)
