from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q

from model_utils import Etag
from abstract_is_admin import AbstractIsAdmin
from node import Node
from devilryuserprofile import DevilryUserProfile



class Candidate(models.Model, Etag, AbstractIsAdmin):
    """
    .. attribute:: assignment_group

        The `AssignmentGroup`_ where this groups belongs.

    .. attribute:: student

        A student (a foreign key to a User).

    .. attribute:: candidate_id

        A optional candidate id. This can be anything as long as it is not
        more than 30 characters. When the assignment is anonymous, this is
        the "name" shown to examiners instead of the username of the
        student.

    .. attribute:: identifier
        The candidate_id if this is a candidate on an anonymous assignment, and username if not.
    """

    class Meta:
        app_label = 'core'

    student = models.ForeignKey(User)
    assignment_group = models.ForeignKey('AssignmentGroup',
                                         related_name='candidates')

    candidate_id = models.CharField(max_length=30, blank=True, null=True, help_text='An optinal candidate id. This can be anything as long as it is less than 30 characters.')
    identifier = models.CharField(max_length=30,
                                  help_text='The candidate_id if this is a candidate on an anonymous assignment, and username if not.')
    full_name = models.CharField(max_length=300, blank=True, null=True,
                                 help_text='None if this is a candidate on an anonymous assignment, and full name if not.')
    email = models.CharField(max_length=300, blank=True, null=True,
                                 help_text='None if this is a candidate on an anonymous assignment, and email address if not.')
    etag = models.DateTimeField(auto_now_add=True)

    @classmethod
    def q_is_admin(cls, user_obj):
        return Q(assignment_group__parentnode__admins=user_obj) | \
            Q(assignment_group__parentnode__parentnode__admins=user_obj) | \
            Q(assignment_group__parentnode__parentnode__parentnode__admins=user_obj) | \
            Q(assignment_group__parentnode__parentnode__parentnode__parentnode__pk__in=Node._get_nodepks_where_isadmin(user_obj))

    def __unicode__(self):
        return self.identifier

    def update_identifier(self, anonymous):
        if anonymous:
            self.full_name = None
            self.email = None
            if not self.candidate_id:
                self.identifier = "candidate-id missing"
            else:
                self.identifier = self.candidate_id
        else:
            self.email = self.student.email
            self.full_name = self.student.devilryuserprofile.full_name
            self.identifier = self.student.username

    def save(self, *args, **kwargs):
        anonymous = kwargs.pop('anonymous', self.assignment_group.parentnode.anonymous)
        self.update_identifier(anonymous)
        super(Candidate, self).save(*args, **kwargs)


def sync_candidate_with_user_on_change(sender, **kwargs):
    """
    Signal handler which is invoked when a User is saved.
    """
    user = kwargs['instance']
    for candidate in Candidate.objects.filter(student=user):
        candidate.save()

post_save.connect(sync_candidate_with_user_on_change,
                  sender=User)


def sync_candidate_with_userprofile_on_change(sender, **kwargs):
    """
    Signal handler which is invoked when a DevilryUserProfile is saved.
    """
    userprofile = kwargs['instance']
    for candidate in Candidate.objects.filter(student=userprofile.user):
        candidate.save()

post_save.connect(sync_candidate_with_userprofile_on_change,
                  sender=DevilryUserProfile)
