from app.api.classes.observatory.models import Observatory
from app.api.classes.observatory.services import getAll, getFirst #testi aina importattava



def test_observatories(app): #App annettava
    list = getAll()
    assert list is not None

def test_getfirstobservatory(app): #App annettava

    assert getFirst().name=='Hangon Lintuasema'    

