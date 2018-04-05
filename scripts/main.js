
(function() {
    'use strict';
    $( document ).ready(function() {
        $('.modal').modal();
      });

    var cardContainer ={
        
        props : {
            searchresults : Array,
        },
        template : `<div>
                        <div class="row">
                            <div v-for="(artist,index) in searchresults" class="col s4">
                                <div class="card">
                                    <div class="card-image">
                                        <img v-bind:src="artist.album.cover_big">
                                        <span class="card-title">{{artist.album.title}}</span>
                                        <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
                                    </div>
                                    <div class="card-content">
                                        <p>{{artist.artist.name}} / {{artist.album.title}}</p>
                                        <p> {{secToMin(index)}}</p>
                                    </div>
                                    <div class="card-action">
                                    <!--<audio controls="controls" >
                                            <source v-bind:src=urlPreviewConstructor(index)  type="audio/mp3 /">
                                        </audio>-->

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
                                    <p>Durée :  {{secToMin()}} / Date de parution : </p>

                                </div>
                                <div class="modal-footer">
                                    <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
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
                    type : ""
                },
                infoTrack : {
                    // album : {},
                    // artist : {} ,
                    // available_countries : [] ,
                    // bpm : 0 ,
                    // contributors : [] ,
                    // disk_number : 0 ,
                    // duration  : 0 ,
                    // explicit_lyrics : false ,
                    // gain : 0 ,
                    // id : 0 ,
                    // isrc : "" ,
                    // link : "" ,
                    // preview : "" ,
                    // rank : 0 ,
                    // readable : "" ,
                    // release_date : "" ,
                    // share : "" ,
                    // title : "" ,
                    // title_short : "" ,
                    // title_version : "" ,
                    // track_position : 0 ,
                    // type : ""
                }
            }
        },

        methods: {
            urlConstructorTrack: function(){
                var url = this.finalUrl;
                url = this.PartUrl1 + this.dataClick.id;
                console.log(url);
                return url;
            },
            urlPreviewConstructor: function(index){
                var urlPreview = this.searchresults[index].preview;
                return urlPreview;
            },
            secToMin : function(){
                // var time = this.searchresults[index].duration;
                // var minutes = Math.floor(time / 60);
                // var seconde = time-(minutes*60);
                // var fulltime = minutes + "m" + seconde+ "s";
                // return fulltime;

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
                this.infoTrackCall(this.getReponse);
                // this.infoTrack = this.infoTrackCall();
                
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
            }
        },

        // created : function(){
            
        // }
    };

 var elApp = new Vue({                 //la variable me sert à refencer l'object
        el: '#app',
        components : { 
            'card-container' : cardContainer ,    
        },
        data : {
                PartUrl1:"https://api.deezer.com/search?q=",
                PartUrl2:"",
                finalUrl:'',
                option: "",
                index: 0,
                indexSave: 0,
                searchresults: [],
                dataClick: {}
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
            }
        },
      })
})();