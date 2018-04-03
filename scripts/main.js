
(function() {
    'use strict';
    $( document ).ready(function() {
        $('.modal').modal();
      });

    //   var manav ={
    //     props : {
    //         searchresults : Array
    //     },
    //     template : `<div>
    //                     <nav>
    //                         <div class="nav-wrapper">
    //                             <a href="#" class="brand-logo">Logo</a>
    //                             <ul id="nav-mobile" class="right hide-on-med-and-down">
    //                                 <li><a href="#">Recherche</a></li>
    //                                 <li><a href="#">Titre</a></li>
    //                                 <li><a href="#">Album</a></li>
    //                                 <li><a href="artist.html">Artist</a></li>
    //                                 <li><a href="#">Favorits</a></li>
    //                             </ul>
    //                         </div>
    //                     </nav>
    //                     <nav>
    //                         <div class="nav-wrapper">
    //                             <form>
    //                                 <div class="input-field">
    //                                     <input id="search" type="search" required >
    //                                     <button v-on:click.prevent="request()" id="search-btn">Rechercher</button>
    //                                     <label class="label-icon" for="search"><i class="material-icons">search</i></label>
    //                                     <i class="material-icons">close</i>
    //                                 </div>
    //                             </form>
    //                         </div>
    //                     </nav>
    //                 </div>`,
    //     data : function() {
    //         return {
    //             PartUrl1:"https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=",
    //             PartUrl2:"",
    //             finalUrl:'',
    //             // option: "",
    //             // index: 0,
    //             // indexSave: 0,
    //             // searchresults: [],
    //             // dataClick: {}
    //         }
    //     },

    //     methods: {
    //         urlConstructor: function(){
    //             var url = this.finalUrl;
    //             if($('#search').val()===""){
    //                 console.log("enter a value");
    //             }else{
    //                 url = this.PartUrl1 + $('#search').val();
    //                 console.log(url);
    //             }
    //             return url;
    //         },
    //         // urlPreviewConstructor: function(index){
    //         //     var urlPreview = this.searchresults[index].preview;
    //         //     return urlPreview;
    //         // },
    //         request: function(){
    //             var urlFinal = this.urlConstructor();
    //             var requette = $.ajax(urlFinal);
    //             console.log(urlFinal);
    //             requette.done(function(reponse){
    //                 var results_json;
    //                 this.searchresults = reponse.data;
    //                 results_json = JSON.stringify(this.searchresults);               // sauvegarder dans une variable la version strigifier de mon object
    //                 localStorage.setItem("resultsStringify",results_json);              // sauvegarder la variable dans le localStorage
    //                 console.log(this.searchresults);
    //                 // return this.searchresults;
    //             });
    //             // this.$parent.$data.searchresults = this.searchresults;

    //         },
    //         // secToMin : function(index){
    //         //     var time = this.searchresults[index].duration;
    //         //     var minutes = Math.floor(time / 60);
    //         //     var seconde = time-(minutes*60);
    //         //     var fulltime = minutes + "m" + seconde+ "s";
    //         //     return fulltime;
    //         // },
    //         // indexCall : function(index){
    //         //     var urlFinal = this.urlConstructor();
    //         //     var requette = $.ajax(urlFinal);
    //         //     console.log(urlFinal);
    //         //     requette.done(function(reponse){
    //         //         this.dataClick = reponse.data[index];
    //         //     });
    //         //     // this.indexSave = index;
    //         //     // this.dataClick = this.searchresults[index];
    //         //     // var imgLink = "url('"+ this.searchresults[index].album.cover_big +"')";
    //         //     // $('#modal1').css({background: imgLink ,opacity:'0.5'});
    //         //     // console.log(this.dataClick);
    //         //     // console.log(imgLink);
    //         // }
    //     },

    //     created : function(){
            
    //     },
    //     mounted : function(){
    //         var results_json = localStorage.getItem("resultsStringify");            // dans la variable recuper la version stringifier 
    //         this.searchresults = JSON.parse(results_json);                          // remplacer mon objet par la sauvegarde destringifier grace a parse 
    //     }
    // };

    var cardcontainer ={
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
                                        <audio controls="controls" >
                                            <source v-bind:src=urlPreviewConstructor(index)  type="audio/mp3 /">
                                        </audio>

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
                                    <a href="#">{{dataClick.title}}</a>
                                </div>
                                <div class="modal-footer">
                                    <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
                                </div>
                            </div>
                        </div>
                    </div>`,
        data : function() {
            return {
                PartUrl1:"https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=",
                PartUrl2:"",
                finalUrl:'',
                option: "",
                index: 0,
                indexSave: 0,
                // searchresults: [],
                dataClick: {}
            }
        },

        methods: {
            // urlConstructor: function(){
            //     var url = this.finalUrl;
            //     if($('#search').val()===""){
            //         console.log("enter a value");
            //     }else{
            //         url = this.PartUrl1 + $('#search').val();
            //         console.log(url);
            //     }
            //     return url;
            // },
            urlPreviewConstructor: function(index){
                var urlPreview = this.searchresults[index].preview;
                return urlPreview;
            },
            // request: function(){
            //     var urlFinal = this.urlConstructor();
            //     var requette = $.ajax(urlFinal);
            //     console.log(urlFinal);
            //     requette.done(function(reponse){
            //         var results_json;
            //         this.searchresults = reponse.data;
            //         results_json = JSON.stringify(this.searchresults);               // sauvegarder dans une variable la version strigifier de mon object
            //         localStorage.setItem("resultsStringify",results_json);              // sauvegarder la variable dans le localStorage
            //         console.log(this.searchresults);
            //     });
            // },
            secToMin : function(index){
                var time = this.searchresults[index].duration;
                var minutes = Math.floor(time / 60);
                var seconde = time-(minutes*60);
                var fulltime = minutes + "m" + seconde+ "s";
                return fulltime;
            },
            indexCall : function(index){
                var urlFinal = this.urlConstructor();
                var requette = $.ajax(urlFinal);
                console.log(urlFinal);
                requette.done(function(reponse){
                    this.dataClick = reponse.data[index];
                });
                // this.indexSave = index;
                // this.dataClick = this.searchresults[index];
                // var imgLink = "url('"+ this.searchresults[index].album.cover_big +"')";
                // $('#modal1').css({background: imgLink ,opacity:'0.5'});
                // console.log(this.dataClick);
                // console.log(imgLink);
            }
        },

        created : function(){
            
        },
        props : {
            searchresults : Array,
        }
    };

 new Vue({                 //la variable me sert à refencer l'object
        el: '#app',
        components : { 
            'cardcontainer' : cardcontainer ,
            // 'manav' : manav        
        },
        data : {
                PartUrl1:"https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=",
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
                var requette = $.ajax(urlFinal);
                console.log(urlFinal);
                requette.done(function(reponse){
                    var results_json;
                    this.searchresults = reponse.data;
                    results_json = JSON.stringify(this.searchresults);               // sauvegarder dans une variable la version strigifier de mon object
                    localStorage.setItem("resultsStringify",results_json);              // sauvegarder la variable dans le localStorage
                    console.log(this.searchresults);
                });
                var results_json = localStorage.getItem("resultsStringify");            // dans la variable recuper la version stringifier 
                this.searchresults = JSON.parse(results_json);                          // remplacer mon objet par la sauvegarde destringifier grace a parse 

            }
        },
        // mounted : function(){
        //     var results_json = localStorage.getItem("resultsStringify");            // dans la variable recuper la version stringifier 
        //     if (results_json === null){
        //         this.searchresults = [];
        //     }
        //     else{
        //         this.searchresults = JSON.parse(results_json);                       // remplacer mon objet par la sauvegarde destringifier grace a parse 
        //     }
            
        // }
      })
})();