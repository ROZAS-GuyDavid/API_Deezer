
(function() {
    'use strict';
    $( document ).ready(function() {
        $('.modal').modal();
        $('.modal').modal({
            onCloseStart: function(){
                console.log($('audio'));
                $('audio').each(function(){
                    this.pause();
                    this.currentTime = 0;
                });
                $('.album').css( "display" , "inherit" );
                $('.artist').css( "display" , "inherit" );
                $('.artist2').css( "display" , "none" );
                $('.track').css( "display" , "inherit" );
                $('.track2').css( "display" , "none" );
            },
        });
    });

    var bus = new Vue(
    );

    var favContainer ={
        template : `<div class="favoris wrapper" id="favoris-page">
                        <h1>Vos favoris</h1>
                        <div v-for="(artist,index) in addedFavoris">
                            <div class="flex">
                                <a v-on:click="removeFav(index)" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">delete_forever</i></a>
                                <i class="material-icons">favorite</i>
                                <p>{{addedFavoris[index].title_short}}</p>
                                <audio ref="player" controls="controls" class="preview-track" v-bind:src="urlPreviewConstructor(index)" type="audio/mp3 /" v-if="isFileATrack(index)"></audio>
                            </div>
                            <hr/>
                        </div>
                    </div>`,
        data : function() {
            return {
                addedFavoris : [],
            }
        },
        computed : {
            
            
        },
        methods: {
            urlPreviewConstructor: function(index){
                var urlPreview = this.addedFavoris[index].preview;
                return urlPreview;
            },
            isFileATrack: function(index) {
                return  this.addedFavoris[index].preview.endsWith('.mp3') || 
                        this.addedFavoris[index].preview.endsWith('.wav') || 
                        this.addedFavoris[index].preview.endsWith('.aif') ? true : false
            },
            removeFav: function(index){
                var addedFavoris_json;
                this.addedFavoris.splice(index,1);
                bus.$emit('remfavoris', index);
                addedFavoris_json = JSON.stringify(this.addedFavoris);
                localStorage.setItem("addedFavorisStringify",addedFavoris_json);
            }
        },
        created : function(){
            bus.$on('addfavoris', (data, index) => {
                this.addedFavoris.splice(index, 1, data[index] );
            });
            var addedFavoris_json = localStorage.getItem("addedFavorisStringify");
            this.addedFavoris = JSON.parse(addedFavoris_json);
        }
    };


    var cardContainer ={
        props : {
            searchresults : Array,
            searchpagetitle : String,
        },
        template : `<div id="search-page" class="wrapper">
                        <h1>{{searchpagetitle}}</h1>
                        <div class="row">
                            <div v-for="(artist,index) in searchresults" class="col s4">
                                <div class="card">
                                    <div class="card-image">
                                        <img v-bind:src="artist.album.cover_big">
                                        <span class="card-title">{{artist.album.title}}</span>
                                        <a v-on:click="verifAddedFav(index)" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">favorite</i></a>
                                    </div>
                                    <div class="card-content">
                                        <p>{{artist.artist.name}} / {{artist.album.title}}</p>
                                        <p> {{secToMin(searchresults[index].duration)}}</p>
                                    </div>
                                    <div class="card-action">
                                        <div class="flex ">
                                            <a id="call-track-modal" v-on:click.prevent="indexCall(index)" class="waves-effect waves-light btn modal-trigger" href="#modal1">Ecouter un extrait</a>
                                            <a id="call-album-modal" v-on:click.prevent="getAlbum(index)" class="waves-effect waves-light btn modal-trigger" href="#modal2">Consulter Album</a>
                                            <a id="call-artist-modal" v-on:click.prevent="openArtist(index)" class="waves-effect waves-light btn modal-trigger" href="#modal3">Voir la fiche de l'artist</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div id="modal1" class="modal">
                                <div class="voile">
                                    <div class="track">
                                        <div class="modal-content">
                                            <div>
                                                <h4>Titre : {{dataClick.title}}</h4>
                                                <p>Album : <a v-on:click.prevent="openAlbum()" class="modal-action modal-close modal-trigger " href="#modal2">{{dataClick.album.title}}</a></p>
                                                <img :src="dataClick.artist.picture_medium">
                                                <p>Artist : <a v-on:click.prevent="openArtist(indexClick)" href="#">{{dataClick.artist.name}}</a></p>
                                                <h4>{{dataClick.title}}</h4>
                                                <p>Durée :  {{secToMin(dataClick.duration)}} / Date de parution : {{convertDate(infoTrack.release_date)}}</p>
                                                <p>Ecouter un extrait :</p>
                                                <audio ref="player" controls="controls" id="preview-track" v-bind:src=dataClick.preview type="audio/mp3 /" v-if="isFileATrack" ></audio>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <a class="waves-effect waves-light btn" v-bind:href="dataClick.link" target="_blank">Voir le titre sur deezer</a>
                                            <a v-on:click="verifAddedFav()" class="waves-effect waves-light btn" href="#">Ajouter au favoris</a>
                                        </div>
                                    </div>
                                    <div class="artist2">
                                        <div class="voile">
                                            <div class="modal-content">
                                                <h4>{{infoArtist.name}}</h4>
                                                <img :src="dataClick.artist.picture_medium">
                                                <p>Nombre d'albums : {{infoArtist.nb_album}}</p>
                                                <p>Nombre de fans : {{infoArtist.nb_fan}}</p>
                                                <button class="btn waves-effect waves-light" v-on:click.prevent="hidePage()"><p>Retour</p><i class="material-icons right">reply</i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div id="modal2" class="modal">
                                <div class="voile">
                                    <div class="album">
                                        <div class="modal-content">
                                            <h4>Album : {{infoAlbum.title}}</h4>
                                            <p>Artist : <a v-on:click.prevent="openArtist(indexClick)" href="#">{{dataClick.artist.name}}</a></p>
                                            <div v-if="infoAlbum.rating === 0" class="rate">
                                                <i class="material-icons">star_border</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i>
                                            </div>
                                            <div v-if="infoAlbum.rating === 1" class="rate">
                                                <i class="material-icons">star</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i>
                                            </div>
                                            <div v-if="infoAlbum.rating === 2" class="rate">
                                                <i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i>
                                            </div>
                                            <div v-if="infoAlbum.rating === 3" class="rate">
                                                <i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star_border</i><i class="material-icons">star_border</i>
                                            </div>
                                            <div v-if="infoAlbum.rating === 4" class="rate">
                                                <i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star_border</i>
                                            </div>
                                            <div v-if="infoAlbum.rating === 5" class="rate">
                                                <i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i>
                                            </div>
                                            <p>Liste des tracks de cette album :</p>
                                            <ul>
                                                <li v-for="(artist,index) in infoAlbum.tracks.data" class="flex">
                                                    {{secToMin(infoAlbum.tracks.data[index].duration)}}
                                                    <a v-on:click.prevent="displayTrackPage(index)" href="#">{{infoAlbum.tracks.data[index].title_short}}</a>
                                                    <audio ref="player" controls="controls" v-bind:src=infoAlbum.tracks.data[index].preview type="audio/mp3 /" v-if="isFileATrack" ></audio>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="modal-footer">
                                            <a class="waves-effect waves-light btn" v-bind:href="infoAlbum.link" target="_blank">Voir l'album sur deezer</a>
                                        </div>
                                    </div>

                                    <div class="artist2">
                                        <div class="voile">
                                            <div class="modal-content">
                                                <h4>{{infoArtist.name}}</h4>
                                                <img :src="dataClick.artist.picture_medium">
                                                <p>Nombre d'albums : {{infoArtist.nb_album}}</p>
                                                <p>Nombre de fans : {{infoArtist.nb_fan}}</p>
                                                <button class="btn waves-effect waves-light" v-on:click.prevent="hidePage()"><p>Retour</p><i class="material-icons right">reply</i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="track2">
                                        <div class="voile">
                                            <div class="modal-content">
                                                <h4>Titre : {{dataClick.title}}</h4>
                                                <p>Album : <a v-on:click.prevent="openAlbum()" class="modal-action modal-close modal-trigger " href="#modal2">{{dataClick.album.title}}</a></p>
                                                <img :src="dataClick.artist.picture_medium">
                                                <p>Artist : <a v-on:click.prevent="openArtist(indexClick)" href="#">{{dataClick.artist.name}}</a></p>
                                                <h4>{{dataClick.title}}</h4>
                                                <p>Durée :  {{secToMin(dataClick.duration)}} / Date de parution : {{convertDate(infoTrack.release_date)}}</p>
                                                <p>Ecouter un extrait :</p>
                                                <audio ref="player" controls="controls" id="preview-track" v-bind:src=dataClick.preview type="audio/mp3 /" v-if="isFileATrack" >
                                                </audio>
                                            </div>
                                            <div class="modal-footer">
                                                <a class="waves-effect waves-light btn" v-bind:href="dataClick.link" target="_blank">Voir le titre sur deezer</a>
                                                <a v-on:click="verifAddedFav(indexTrack)" class="waves-effect waves-light btn" href="#">Ajouter au favoris</a>
                                                <button class="btn waves-effect waves-light" v-on:click.prevent="hidePage()"><p>Retour</p><i class="material-icons right">reply</i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div id="modal3" class="modal">
                                <div class="voile">
                                    <div class="artist">
                                        <div class="modal-content">
                                            <h4>{{infoArtist.name}}</h4>
                                            <img :src="dataClick.artist.picture_medium">
                                            <p>Nombre d'albums : {{infoArtist.nb_album}}</p>
                                            <p>Nombre de fans : {{infoArtist.nb_fan}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`,
        data : function() {
            return {
                PartUrl1:"https://api.deezer.com/track/",
                PartUrl2:"https://api.deezer.com/album/",
                PartUrl3:"https://api.deezer.com/artist/",
                // finalUrl:'',
                option: "",
                index: 0,
                indexSave: 0,
                indexFav: 0,
                indexTrack: 0,
                indexClick: 0,
                dataClick: {
                    album : {},
                    artist : {},
                    duration : 0,
                    explicit_lyrics: false,
                    id : 0,
                    link : "",
                    preview : "",
                    rank : 0,
                    readable : false,
                    title : "",
                    title_short : "",
                    title_version : "",
                    type : "",
                },
                addedFavoris : [],
                infoTrack : {},
                infoTrack2 : {},
                infoArtist : {},
                infoAlbum : {
                    artist : {},
                    tracks : {
                        data: [Object]
                    }
                }
            }
        },
        computed : {
            // urlPreviewConstructor: function(){
            //     var urlPreview = this.dataClick.preview;
            //     return urlPreview;
            // },
            
            isFileATrack: function() {
                return this.dataClick.preview.endsWith('.mp3') || 
                        this.dataClick.preview.endsWith('.wav') || 
                        this.dataClick.preview.endsWith('.aif') ? true : false
            }
        },
        methods: {
            openAlbum : function(){
                this.getAlbum(this.indexClick);
            },
            openArtist : function(index){
                this.indexCall(index);
                $('.artist2').css( "display" , "inherit" );
                $('.album').css( "display" , "none" );
                $('.track').css( "display" , "none" );
                $('.track2').css( "display" , "none" );
                var imgLink = "url('"+ this.dataClick.album.cover_big +"')";
                $('#modal3').css({background: imgLink ,backgroundSize:'cover'});
            },
            openTrack : function(index){
                this.indexCall(index);
                $('.track').css( "display" , "inherit" );
                $('.artist2').css( "display" , "none" );
                $('.album').css( "display" , "none" );
            },
            displayTrackPage : function(index){
                    this.dataClick.album = this.infoAlbum;
                    this.dataClick.artist = this.infoAlbum.artist;
                    this.dataClick.duration = this.infoAlbum.tracks.data[index].duration;
                    this.dataClick.explicit_lyrics = this.infoAlbum.tracks.data[index].explicit_lyrics;
                    this.dataClick.id = this.infoAlbum.tracks.data[index].id;
                    this.dataClick.link = this.infoAlbum.tracks.data[index].link;
                    this.dataClick.preview = this.infoAlbum.tracks.data[index].preview;
                    this.dataClick.rank = this.infoAlbum.tracks.data[index].rank;
                    this.dataClick.readable = this.infoAlbum.tracks.data[index].readable;
                    this.dataClick.title = this.infoAlbum.tracks.data[index].title;
                    this.dataClick.title_short = this.infoAlbum.tracks.data[index].title_short;
                    this.dataClick.title_version = this.infoAlbum.tracks.data[index].title_version;
                    this.dataClick.type = this.infoAlbum.tracks.data[index].type;
                    this.indexTrack = index;

                    $('.album').css( "display" , "none" );
                    $('.track2').css( "display" , "inherit" );
            },
            hidePage : function(){
                $('.album').css( "display" , "inherit" );
                $('.artist').css( "display" , "inherit" );
                $('.artist2').css( "display" , "none" );
                $('.track').css( "display" , "inherit" );
                $('.track2').css( "display" , "none" );
                $('audio').each(function(){
                    this.pause();
                    this.currentTime = 0;
                });
            },
            albumRequette: function(id, getReponseArtist){
                var urlFinal = this.urlConstructorArtist(id);
                $.ajax({
                    url : urlFinal,
                    dataType : 'jsonp', // <-- Informe jQuery qu'il recevra du JSONP de la part de Deezer
                    data : {
                        output : 'jsonp', // <-- Indique à Deezer que le format de retour doit être du JSONP
                    },
                    success: function( reponse ) {
                        getReponseArtist(reponse)
                        return reponse;
                    },
                    errorCallback: function( reponse ) {
                        alert("votre recherche n'as pas aboutie à un resultat");
                    }
                });
                // $('.artist2').css( "display" , "inherit" );
                // $('.album').css( "display" , "none" );
                // $('.track').css( "display" , "none" );


            },
            urlConstructorArtist: function(id){
                var url;
                url = this.PartUrl3 + id;
                console.log(url);
                return url;
            },
            urlConstructorTrack: function(){
                var url;
                url = this.PartUrl1 + this.dataClick.id;
                console.log(url);
                return url;
            },
            urlConstructorAlbum: function(){
                var url;
                url = this.PartUrl2 + this.dataClick.album.id;
                console.log(url);
                return url;
            },
            secToMin : function(time){
                var minutes = Math.floor(time / 60);
                var seconde = time-(minutes*60);
                var fulltime = minutes + "m" + seconde+ "s";
                return fulltime;
            },
            getAlbum : function(index){
                this.indexClick = index;
                this.dataClick = this.searchresults[index];
                var imgLink = "url('"+ this.dataClick.album.cover_big +"')";
                $('#modal2').css({background: imgLink ,backgroundSize:'cover'});
                this.AlbumCall(this.getReponseAlbum);
            },
            AlbumCall : function(getReponseAlbum){
                var urlFinal = this.urlConstructorAlbum();
                $.ajax({
                    url : urlFinal,
                    dataType : 'jsonp', // <-- Informe jQuery qu'il recevra du JSONP de la part de Deezer
                    data : {
                        output : 'jsonp', // <-- Indique à Deezer que le format de retour doit être du JSONP
                    },
                    success: function( reponse ) {
                        getReponseAlbum(reponse)
                        return reponse;
                    },
                    errorCallback: function( reponse ) {
                        alert("votre recherche n'as pas aboutie à un resultat");
                    }
                });
            },
            indexCall : function(index){
                this.indexClick = index;
                this.dataClick = this.searchresults[index];
                var imgLink = "url('"+ this.searchresults[index].album.cover_big +"')";
                $('#modal1').css({background: imgLink ,backgroundSize:'cover'});
                
                // this.dataClick.show = true;
                this.infoTrackCall(this.getReponse);
                this.albumRequette(this.dataClick.artist.id, this.getReponseArtist);
            },
            infoTrackCall : function(getReponse){
                var urlFinal = this.urlConstructorTrack();
                $.ajax({
                    url : urlFinal,
                    dataType : 'jsonp', // <-- Informe jQuery qu'il recevra du JSONP de la part de Deezer
                    data : {
                        output : 'jsonp', // <-- Indique à Deezer que le format de retour doit être du JSONP
                    },
                    success: function( reponse ) {
                        getReponse(reponse)
                        return reponse;
                    },
                    errorCallback: function( reponse ) {
                        alert("votre recherche n'as pas aboutie à un resultat");
                    }
                });
            },
            getReponseArtist : function(reponse){
                console.log(reponse);
                this.infoArtist = reponse;
                var imgLink = "url('"+ this.infoArtist.picture_big +"')";
                $('#modal2 .artist').css({background: imgLink ,backgroundSize:'cover'});
            },
            getReponseAlbum : function(reponse){
                console.log(reponse);
                this.infoAlbum = reponse;

            },
            getReponse : function(reponse){
                console.log(reponse);
                this.infoTrack = reponse;
            },
            convertDate : function( dateString ){
                var date = new Date(dateString);
                return date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
            },
            addfavoris : function(index , find){
                var addedFavoris_json;

                if (find === false){  
                    if(index => 0){
                        this.addedFavoris.splice(this.indexFav, 1, this.searchresults[index]);
                    };
                    if(index === undefined){
                        this.addedFavoris.splice(this.indexFav, 1, this.dataClick);
                    };
                    bus.$emit('addfavoris', this.addedFavoris, this.indexFav);
                    this.indexFav += 1;

                    
                    addedFavoris_json = JSON.stringify(this.addedFavoris);
                    localStorage.setItem("addedFavorisStringify",addedFavoris_json);
                };
            },
            verifAddedFav: function(index){
                var find = false;
  
                for( var i = 0; i < this.addedFavoris.length ; i++){
                    if(index || index === 0){
                        var idx1 = this.searchresults[index].id;
                        if(idx1 === this.addedFavoris[i].id){
                            find = true;
                        };
                    }
                    else{
                        var idx2 = this.dataClick.id;
                        if(idx2 === this.addedFavoris[i].id){
                            find = true;
                        };
                    };
                };
                console.log(find);
                this.addfavoris(index , find);
                //ToDo verifier aussi dans addedFavoris de la page favoris
            },
        },
        created : function(){
            var addedFavoris_json = localStorage.getItem("addedFavorisStringify");
                
            bus.$on('remfavoris', (index) => {
                this.indexFav -=1;
                this.addedFavoris.splice(index, 1);
            });
            this.addedFavoris = JSON.parse(addedFavoris_json);
                this.indexFav = this.addedFavoris.length;
        }
    };

 var elApp = new Vue({                 //la variable me sert à refencer l'object
        el: '#app',
        components : { 
            'card-container' : cardContainer ,
            'fav-container'  : favContainer,
        },
        data : {
                PartUrl1:"https://api.deezer.com/search?q=",
                PartUrl2:"",
                finalUrl:'',
                option: "",
                index: 0,
                indexSave: 0,
                searchresults: [],
                dataClick: {},
                addedFavoris : [],
                searchpagetitle : "",
                orderOption : "",
            }
        ,
        filters : {
        },
        methods: {
            urlConstructor: function(){
                var url = this.finalUrl;
                if($('#search').val()===""){
                    console.log("enter a value");
                }else{
                    url = this.PartUrl1 + $('#search').val();
                    console.log(url);
                }
                return url;
            },
            trie : function(){
                if($('.select-trie')[0].value === "trieAlbum"){
                    // var i = 0;
                    // var searchresultsSave = {}; 
                    // var comp1 = ""; 
                    // var comp2 = ""; 
                    // var  test = 25;
                    // for(var i = test; i>0; i--){
                    //     // console.log(i);
                    //     comp1 = this.searchresults[i].album.title;
                    //     comp2 = this.searchresults[i-1].album.title;
                    //     if (comp1 > comp2){
                    //         // searchresultsSave = this.searchresults[i-1];
                    //         // this.searchresults.splice((i-1), 1, this.searchresults[i] );
                    //         // this.searchresults.splice(i, 1, searchresultsSave );
                    //         // console.log("true");
                    //         console.log(i);
                    //     };
                    //   };
                };
                if($('.select-trie')[0].value === "trieArtist"){
                    alert('blro');
                };
                if($('.select-trie')[0].value === "trieMusique"){

                };
                if($('.select-trie')[0].value === "triePop"){

                };
                if($('.select-trie')[0].value === "trieNote"){

                };
            },
            request: function(){
                this.callSearchPage();
                var urlFinal = this.urlConstructor();
                $.ajax({
                    url : urlFinal,
                    dataType : 'jsonp', // <-- Informe jQuery qu'il recevra du JSONP de la part de Deezer
                    data : {
                        output : 'jsonp', // <-- Indique à Deezer que le format de retour doit être du JSONP
                    },
                    success: function( reponse ) {
                        elApp.searchresults = reponse.data;
                        console.log(this.searchresults);
                        console.log( reponse );
                        elApp.searchpagetitle = "Votre recherche compte " + elApp.searchresults.length + " résultats!";
                    },
                    errorCallback: function( reponse ) {
                        alert("votre recherche n'as pas aboutie à une resultat");
                    }
                })
            },
            callFavPage : function(){
                $('#search-page').css('display','none');
                $('#favoris-page').css('display','inherit');
            },
            callSearchPage : function(){
                $('#search-page').css('display','inherit');
                $('#favoris-page').css('display','none');
            }
        },
      })
})();

