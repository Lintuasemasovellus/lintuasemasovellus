# Docker-ohje
Dockeria ei tarvitse sovelluksen ajamiseen,mutta Dockerin avulla voi suorittaa sovelluksen ilman että on asentanut Pythonia, Nodea jne. Kun Docker on asennettuna, niin komento `docker build -t lintuasema .` sovelluksen juurikansiossa luo lintuasema-nimisen Docker imagen. Imagen voi suorittaa komennolla `docker run -p 3000:3000 lintuasema`. Tämä avaa sovelluksen osoitteeseen 0.0.0.0:3000. Jos sovellusta muokkaa, niin tämä ei heijastu olemassa olevaan imageen. Docker image voi viedä paljon tilaa, sen voi poistaa esim. komennolla `docker system prune -a
`. Tämä poistaa kaikki koneella olevat Docker imaget ja containerit.

Dockeria tarvitaan suurimmaksi osin Rahti-palvelimelle.

https://docs.csc.fi/cloud/rahti/
