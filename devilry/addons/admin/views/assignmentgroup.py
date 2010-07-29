import re

from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponseForbidden
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django import forms
from django.utils.translation import ugettext as _
from django.forms.models import inlineformset_factory, formset_factory
from django.contrib.auth.models import User

from devilry.core.models import Assignment, AssignmentGroup, \
        Deadline, Candidate
from devilry.ui.widgets import DevilryDateTimeWidget, \
    DevilryMultiSelectFewUsersDb, DevilryMultiSelectFewCandidates
from devilry.ui.fields import MultiSelectCharField

from shortcuts import EditBase, list_nodes_generic



class DeadlineForm(forms.ModelForm):
    deadline = forms.DateTimeField(widget=DevilryDateTimeWidget)
    text = forms.CharField(required=False,
            widget=forms.Textarea(attrs=dict(rows=5, cols=50)))
    class Meta:
        model = Deadline

class EditAssignmentGroup(EditBase):
    VIEW_NAME = 'assignmentgroup'
    MODEL_CLASS = AssignmentGroup
    
    def create_form(self):
        class Form(forms.ModelForm):
            parentnode = forms.ModelChoiceField(required=True,
                    queryset = Assignment.where_is_admin(self.request.user))
            examiners = MultiSelectCharField(widget=DevilryMultiSelectFewUsersDb,
                                             required=False)
                        
            class Meta:
                model = AssignmentGroup
                fields = ['parentnode', 'name', 'examiners', 'is_open']
                widgets = {
                    'examiners': DevilryMultiSelectFewUsersDb,
                    }
        return Form

    def create_view(self):
        DeadlineFormSet = inlineformset_factory(AssignmentGroup, Deadline,
                extra=1, form=DeadlineForm)
        CandidatesFormSet = inlineformset_factory(AssignmentGroup,
                Candidate, extra=1)

        model_name = AssignmentGroup._meta.verbose_name
        model_name_dict = {'model_name': model_name}
        form_cls = self.create_form()

        if self.request.POST:
            objform = form_cls(self.request.POST, instance=self.obj)
            deadline_formset = DeadlineFormSet(self.request.POST,
                    instance=self.obj)
            candidates_formset = CandidatesFormSet(self.request.POST,
                    instance=self.obj)
            if objform.is_valid() \
                    and deadline_formset.is_valid() \
                    and candidates_formset.is_valid():
                if not self.obj.can_save(self.request.user):
                    return HttpResponseForbidden("Forbidden")
                objform.save()
                deadline_formset.save()
                candidates_formset.save()
                success_url = self.get_reverse_url(str(self.obj.pk))
                return HttpResponseRedirect(success_url)
        else:
            objform = form_cls(instance=self.obj)
            deadline_formset = DeadlineFormSet(instance=self.obj)
            candidates_formset = CandidatesFormSet(instance=self.obj)

        if self.obj.id == None:
            self.title = _('New %(model_name)s') % model_name_dict
        else:
            self.title = _('Edit %(model_name)s' % model_name_dict)

        return render_to_response(
                'devilry/admin/edit_assignmentgroup.django.html', {
                    'title': self.title,
                    'model_plural_name': AssignmentGroup._meta.verbose_name_plural,
                    'nodeform': objform,
                    'messages': self.messages,
                    'post_url': self.post_url,
                    'deadline_form': deadline_formset,
                    'candidates_form': candidates_formset
                }, context_instance=RequestContext(self.request))



class AssignmentgroupForm(forms.Form):
        name = forms.CharField(required=False)
        candidates = forms.CharField(widget=DevilryMultiSelectFewCandidates, required=False)
        
        def clean(self):
            cleaned_data = self.cleaned_data
            name = cleaned_data.get("name")
            cands = cleaned_data.get("candidates")

            if name.strip() == '' and cands.strip() == '':
                # Only do something if both fields are valid so far.
                raise forms.ValidationError("Either name or candidates must be filled in.")
   
            # Always return the full collection of cleaned data.
            return cleaned_data


class CreateAssignmentgroups(object):
    def save_assignmentgroups(self, request, assignment, initial_data=None):
        """
        If ``initial_data`` is set, saving is skipped. 
        """
        if request.POST:
            AssignmentGroupsFormSet = formset_factory(AssignmentgroupForm,
                    extra=0)
            if initial_data:
                formset = AssignmentGroupsFormSet(initial=initial_data)
            else:
                formset = AssignmentGroupsFormSet(request.POST)

            if formset.is_valid() and not initial_data:
                for i in range(0, formset.total_form_count()):
                    form = formset.forms[i]
                    name = None
                    candidates = None

                    if 'name' in form.cleaned_data:
                        name = form.cleaned_data['name']
                    if 'candidates' in form.cleaned_data:
                        candidates = form.cleaned_data['candidates']

                    if name or candidates:
                        self.save_group(assignment, name, candidates)
                return HttpResponseRedirect(reverse(
                    'devilry-admin-edit_assignment', args=[assignment.id]))
            return render_to_response(
                'devilry/admin/verify_assignmentgroups.django.html', {
                    'formset': formset,
                    'assignment': assignment,
                    }, context_instance=RequestContext(request))
        else:
            return HttpResponseForbidden('Forbidden')

    def save_group(self, assignment, name, candidates):
        ag = AssignmentGroup()
        ag.parentnode = assignment
        if name:
            ag.name = name
        ag.save()
        if candidates:
            sep = re.compile(r',\s*')
            candsplit = sep.split(candidates)
            for user in candsplit:
                user_cand = user.split(':')
                try:
                    print "finding user:", user_cand[0]
                    userobj = User.objects.get(username=user_cand[0])
                    cand = Candidate()
                    cand.student = userobj
                    cand.assignment_group = ag
                    
                    if len(user_cand) == 2 and user_cand[1].isdigit():
                        cand.candidate_id = user_cand[1]
                    cand.save()
                    ag.candidates.add(cand)
                    ag.save()
                except Exception as e:
                    print e
                    print "user %s doesnt exist" % (user_cand)


@login_required
def edit_assignmentgroup(request, obj_id=None, successful_save=False):
    return EditAssignmentGroup(request, obj_id, successful_save).create_view()

@login_required
def list_assignmentgroups(request):
    return list_nodes_generic(request, AssignmentGroup)

@login_required
def save_assignmentgroups(request, assignment_id):
    assignment = get_object_or_404(Assignment, pk=assignment_id)
    return CreateAssignmentgroups().save_assignmentgroups(request, assignment)

@login_required
def create_assignmentgroups(request, assignment_id):
    assignment = get_object_or_404(Assignment, pk=assignment_id)

    class Form(forms.Form):
        assignment_groups = forms.CharField(widget=forms.widgets.Textarea())

    if request.POST:
        form = Form(request.POST) 
        if form.is_valid():
            groups = form.cleaned_data['assignment_groups']
            lines = groups.splitlines()
            initial_data = []
            
            for l in lines:
                if l.strip() == "":
                    continue
                m = re.match("(?:(?P<name>.+?)::)?\s*(?P<users>.+)?", l)
                if not m:
                    continue
                
                group_data = {}
                name = m.group('name')
                users = m.group('users')
                if name:
                    group_data['name'] = name
                if users:
                    group_data['candidates'] = users
                initial_data.append(group_data)
            return CreateAssignmentgroups().save_assignmentgroups(request,
                    assignment, initial_data)
    else:
        form = Form()

    return render_to_response('devilry/admin/create_assignmentgroups.django.html', {
            'form': form,
            'assignment': assignment,
            }, context_instance=RequestContext(request))