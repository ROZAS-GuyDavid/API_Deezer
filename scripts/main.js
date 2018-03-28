
(function() {
    'use strict';
      // créer une instance racine
      var main = new Vue({                 //la variable me sert à refencer l'object
        el: '#cardContainer',
        data: {
            PartUrl1:"https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=",
            PartUrl2:"",
            finalUrl:'',
            option: "",
            index: 0,
            searchResults: []
        },
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
            urlPreviewConstructor: function(index){
                var urlPreview = main.searchResults[index].preview;
                console.log(main.searchResults[index].preview)
                return urlPreview;
            },
            request: function(){
                var urlFinal = this.urlConstructor();
                var requette = $.ajax(urlFinal);
                console.log(urlFinal);
                requette.done(function(reponse){
                    main.searchResults = reponse.data;
                    console.log(main.searchResults);
                });
            },
            secToMin : function(index){
                console.log(index);
                var time = main.searchResults[index].duration;
                var minutes = Math.floor(time / 60);
                var seconde = time-(minutes*60);
                var fulltime = minutes + "m" + seconde+ "s";
                return fulltime;
            }
        }
      })
})();