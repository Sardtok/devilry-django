from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from django.test import TestCase
from ..models import Node
from ..testhelper import TestHelper

class TestNode(TestCase, TestHelper):

    def setUp(self):
        self.add(nodes="uio:admin(uioadmin).ifi:admin(ifiadmin)")
        self.add(nodes="uio.phys")
        self.add(nodes="uio.deepdummy1.deepdummy2.deepdummy3")

    def test_unique(self):
        n = Node(parentnode=self.deepdummy1, short_name='ifi', long_name='Ifi')
        n.save()
        n.parentnode = self.uio
        self.assertRaises(IntegrityError, n.save)

    def test_unique_noneparent(self):
        n = Node(parentnode=None, short_name='stuff', long_name='Ifi')
        n.clean()
        n.save()
        n2 = Node(parentnode=None, short_name='stuff', long_name='Ifi')
        self.assertRaises(ValidationError, n2.clean)

    def test_can_save(self):
        self.assertFalse(Node().can_save(self.ifiadmin))

    def test_short_name_validation(self):
        self.uio.short_name = '1'
        self.uio.full_clean()
        self.uio.short_name = '_'
        self.uio.full_clean()
        self.uio.short_name = '-'
        self.uio.full_clean()
        self.uio.short_name = 'u'
        self.uio.full_clean()
        self.uio.short_name = 'u-i_o--0'
        self.uio.full_clean()
        self.uio.short_name = 'L'
        self.assertRaises(ValidationError, self.uio.full_clean)

    def test_unicode(self):
        self.assertEquals(unicode(self.deepdummy3),
                'uio.deepdummy1.deepdummy2.deepdummy3')

    def test_get_path(self):
        self.assertEquals(self.uio.get_path(), 'uio')
        self.assertEquals(self.ifi.get_path(), 'uio.ifi')
        self.assertEquals(self.deepdummy3.get_path(), 'uio.deepdummy1.deepdummy2.deepdummy3')

    def test_iter_childnodes(self):
        self.assertEquals(
                [n.short_name for n in self.deepdummy1.iter_childnodes()],
                [u'deepdummy2', u'deepdummy3'])
        s = set([n.short_name for n in self.uio.iter_childnodes()])
        self.assertEquals(s, set([u'deepdummy1', u'deepdummy2', u'deepdummy3', u'phys', u'ifi']))

    def test_clean_parent_is_child(self):
        """ Can not be child of it's own child. """
        self.uio.parentnode = self.ifi
        self.assertRaises(ValidationError, self.uio.clean)

    def test_clean_parent_is_self(self):
        """ Can not be child of itself. """
        self.uio.parentnode = self.uio
        self.assertRaises(ValidationError, self.uio.clean)

    def test_clean_noerrors(self):
        self.ifi.clean()

    def test_create_multiple_roots(self):
        n = Node(short_name='test', long_name='Test', parentnode=None)
        n.clean()
        n.save()
        n2 = Node(short_name='test2', long_name='Test2', parentnode=None)
        n2.clean()
        n2.save()

    def test_where_is_admin(self):
        self.assertEquals(Node.where_is_admin(self.uioadmin).count(), 6)
        self.assertEquals(Node.where_is_admin(self.ifiadmin).count(), 1)

    def test_get_pathlist_kw(self):
        expected = {
                'short_name': 'deepdummy3',
                'parentnode__short_name': 'deepdummy2',
                'parentnode__parentnode__short_name': 'deepdummy1',
                'parentnode__parentnode__parentnode__short_name': 'uio'
                }
        self.assertEquals(expected,
                Node.get_by_path_kw(
                    ['uio', 'deepdummy1', 'deepdummy2', 'deepdummy3']))

    def test_get_by_path(self):
        self.assertEquals(
                Node.get_by_path('uio.deepdummy1.deepdummy2').short_name,
                'deepdummy2')
        self.assertRaises(Node.DoesNotExist, Node.get_by_path,
                'uio.deepdummy1.nonode')
        self.assertRaises(Node.DoesNotExist, Node.get_by_path,
                'does.not.exist')

    def test_get_nodepks_where_is_admin(self):
        self.add(nodes="uio.matnat.math:admin(testadmin)")
        self.add(nodes="uio.matnat.phys.test1:admin(testadmin)")
        self.add(nodes="uio.matnat.chem:admin(testadmin)")
        self.add(nodes="uio.matnat.bio:admin(testadmin)")
        self.add(nodes="uio.matnat.bio.test1")
                
        pk_verify = []
        pk_verify.append(Node.get_by_path("uio.matnat.math").id)
        pk_verify.append(Node.get_by_path("uio.matnat.phys.test1").id)
        pk_verify.append(Node.get_by_path("uio.matnat.chem").id)
        pk_verify.append(Node.get_by_path("uio.matnat.bio").id)
        pk_verify.append(Node.get_by_path("uio.matnat.bio.test1").id)
        
        testadmin = User.objects.get(username='testadmin')
        pks = Node._get_nodepks_where_isadmin(testadmin)
        pks.sort()
        pk_verify.sort()
        self.assertEquals(set(pks), set(pk_verify))
        