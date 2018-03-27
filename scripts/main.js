// (function() {
//     'use strict';
    
//     Vue.component('song-card-tmpl', {
//         template: '<div><img src="" alt=""><h2></h2><p>eminem / curtain call</p><p>5m26</p><a class="waves-effect waves-light btn">button</a><a class="waves-effect waves-light btn">button</a><a class="waves-effect waves-light btn">button</a></div>'
//       })
      
//       // créer une instance racine
//       new Vue({
//         el: '#song-title-cards',
//         data: {
//             searchResults: []
//         },
//         methods: {
//             meth: function(){
//                 // var TabResults = [];
//                 // var MinTabResults = [];

//                 // var search="https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=" + $('#search').val();
//                 // var requette = $.ajax(search);

//                 // requette.done(function(reponse){
//                 //     //$('#test').text(reponse.data);
//                 //     //console.log(reponse.data);
//                 //     TabResults = reponse.data;
//                 //     MinTabResults = TabResults.slice(0,3);
//                 //     console.log(TabResults);
//                 // });
//                 // requette.fail(function(){
//                 //     alert('we got a probleme. call youston');  
//                 // });
//                 // this.searchResults = MinTabResults;
//                 var TabResults = [];
//                 var MinTabResults = [];
//                 (function(){
//                     $(document).ready(function(){
//                         $('#search-btn').on('click', function(event){
//                             event.preventDefault();    // preventDefault() empenche le navigateur de naviger vers le liens href
//                             //console.log($('#search').val());
//                             var search="https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=" + $('#search').val();
//                             var requette = $.ajax(search);

//                             requette.done(function(reponse){
//                                 //$('#test').text(reponse.data);
//                                 //console.log(reponse.data);
//                                 TabResults = reponse.data;
//                                 MinTabResults = TabResults.slice(0,3);
//                                 this.searchResults = MinTabResults;
//                                 console.log(TabResults);
//                             });
//                             requette.fail(function(){
//                                 alert('we got a probleme. call youston');  
//                             });
//                         });
//                     });
//                 })();
//             }
//         }
//       })
// })();