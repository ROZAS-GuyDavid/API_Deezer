
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
            }
        });
    });

    var bus = new Vue(
    );

    var favContainer ={
        template : `<div class="favoris wrapper" id="favoris-page">
                        <div v-for="(artist,index) in addedFavoris">
                            <div class="flex">
                                <a v-on:click="removeFav(index)" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">favorite</i></a>
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
                // addedFavoris_json = JSON.stringify(this.addedFavoris);
                // localStorage.setItem("addedFavorisStringify",addedFavoris_json);
            }
        },
        created : function(){
            // var addedFavoris_json = localStorage.getItem("addedFavorisStringify");
            // if (this.addedFavoris ==! JSON.parse(addedFavoris_json)){
            //     this.addedFavoris = JSON.parse(addedFavoris_json);
            // };
            bus.$on('addfavoris', (data) => {
                this.addedFavoris = data;
            })
        }
    };


    var cardContainer ={
        props : {
            searchresults : Array,
        },
        template : `<div id="search-page" class="wrapper">
                        <div class="row">
                            <div v-for="(artist,index) in searchresults" class="col s4">
                                <div class="card">
                                    <div class="card-image">
                                        <img v-bind:src="artist.album.cover_big">
                                        <span class="card-title">{{artist.album.title}}</span>
                                        <a v-on:click="verifAddedFav(index)" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
                                    </div>
                                    <div class="card-content">
                                        <p>{{artist.artist.name}} / {{artist.album.title}}</p>
                                        <p> {{secToMin(index)}}</p>
                                    </div>
                                    <div class="card-action">
                                        <div class="flex ">
                                            <a v-on:click="indexCall(index)" class="waves-effect waves-light btn modal-trigger" href="#modal1">Ecouter un extrait</a>
                                            <a class="waves-effect waves-light btn modal-trigger" href="#modal2">Consulter Album</a>
                                            <a class="waves-effect waves-light btn modal-trigger" href="#modal3">Voir la fiche de l'artist</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div id="modal1" class="modal">
                                <div class="modal-content">
                                    <h4>Titre : {{dataClick.title}}</h4>
                                    <p>Album : <a href="#">{{dataClick.album.title}}</a></p>
                                    <img :src="dataClick.artist.picture_small">
                                    <p>Artist : <a href="#">{{dataClick.artist.name}}</a></p>
                                    <h4>{{dataClick.title}}</h4>
                                    <p>Durée :  {{secToMin()}} / Date de parution : {{convertDate(infoTrack.release_date)}}</p>
                                    <p>Ecouter un extrait :</p>
                                    <audio ref="player" controls="controls" id="preview-track" v-bind:src=urlPreviewConstructor type="audio/mp3 /" v-if="isFileATrack" >
                                    </audio>
                                </div>
                                <div class="modal-footer">
                                    <a class="waves-effect waves-light btn" href="#modal2">Voir le titre sur deezer</a>
                                    <a v-on:click="verifAddedFav()" class="waves-effect waves-light btn" href="#modal3">Ajouter au favoris</a>
                                </div>
                            </div>
                        </div>
                    </div>`,
        data : function() {
            return {
                PartUrl1:"https://api.deezer.com/track/",
                PartUrl2:"",
                finalUrl:'',
                option: "",
                index: 0,
                indexSave: 0,
                indexFav: 0,
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
                infoTrack : {
                }
            }
        },
        computed : {
            urlPreviewConstructor: function(){
                var urlPreview = this.dataClick.preview;
                return urlPreview;
            },
            isFileATrack: function() {
                return this.dataClick.preview.endsWith('.mp3') || 
                        this.dataClick.preview.endsWith('.wav') || 
                        this.dataClick.preview.endsWith('.aif') ? true : false
            }
        },
        methods: {
            urlConstructorTrack: function(){
                var url = this.finalUrl;
                url = this.PartUrl1 + this.dataClick.id;
                console.log(url);
                return url;
            },
            secToMin : function(){
                var time = this.dataClick.duration;
                var minutes = Math.floor(time / 60);
                var seconde = time-(minutes*60);
                var fulltime = minutes + "m" + seconde+ "s";
                return fulltime;
            },
            indexCall : function(index){
                this.dataClick = this.searchresults[index];
                // var imgLink = "url('"+ this.searchresults[index].album.cover_big +"')";
                // $('#modal1').css({background: imgLink ,opacity:'0.5'});
                this.dataClick.show = true;
                this.infoTrackCall(this.getReponse);
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
                    if(index){
                        this.addedFavoris[this.indexFav] = this.searchresults[index];
                        this.indexFav += 1;
                    }
                    else{
                        this.addedFavoris[this.indexFav] = this.dataClick;
                        this.indexFav += 1;
                    };
                    bus.$emit('addfavoris', this.addedFavoris);
                    // addedFavoris_json = JSON.stringify(this.addedFavoris);
                    // localStorage.setItem("addedFavorisStringify",addedFavoris_json);
                };
            },
            verifAddedFav: function(index){
                var find = false;
  
                for( var i = 0; i < this.addedFavoris.length ; i++){
                    if(index){
                        var idx1 = this.searchresults[index].album.id;
                        if(idx1 === this.addedFavoris[i].album.id){
                            find = true;
                        };
                    }
                    else{
                        var idx2 = this.dataClick.album.id;
                        if(idx2 === this.addedFavoris[i].album.id){
                            find = true;
                        };
                    };
                };
                console.log(find);
                this.addfavoris(index , find);
            },
        },
        created : function(){
            // var addedFavoris_json = localStorage.getItem("addedFavorisStringify");
            // if (this.addedFavoris ==! JSON.parse(addedFavoris_json)){
            //     this.addedFavoris = JSON.parse(addedFavoris_json);
            // };
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

