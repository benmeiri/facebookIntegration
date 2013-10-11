

var videoPlayerHandler = {};


videoPlayerHandler.init = function(){

    videoPlayerHandler.populatePlayList();
    videoPlayerHandler.setInput();


};

videoPlayerHandler.setSearchText = function(text){
    videoPlayerHandler._searchText = text;
}

videoPlayerHandler.searchText = function(){

    if (videoPlayerHandler._searchText !== undefined && videoPlayerHandler._searchText !== ""){


        console.log(videoPlayerHandler._searchText);
        videoPlayerHandler.clearVideoList();
        //$.getJSON("/youtube/videos?q=myQuery",
        $.getJSON("/youtube/videos",
            function(data) {
                videoPlayerHandler.populateList(data);
            }).fail(function(){alert("error");});

    }
}

videoPlayerHandler.clearVideoList = function (){
    $(".videoList ul").html("");
}

videoPlayerHandler.setInput = function(){

    $(".filterInput").keyup(function() {

        //console.log($(".filterInput").val());
        var filterString = $(this).val();
        if (filterString) {
            $('.videoList li[name*="' + filterString + '"]').show();
            $('.videoList li').not('[name*="' + filterString + '"]').hide();
        }else{
            $('.videoList li').show();
        }

    });
}

videoPlayerHandler.addAddButtonFunctionality = function(listItem){

    $(listItem).find(".add-to-playlist-button").click(
        function(){
            var listItemData = listItem.data("videoData");
            var length = videoPlayerHandler.playList.length;
            for (var i = 0 ; i < length ; i++){
                if (videoPlayerHandler.playList[i].id === listItemData.id){
                    return;
                }
            }
            videoPlayerHandler.playList.push(listItemData);
            if (typeof(Storage)!==undefined){
                localStorage.playlistObject = JSON.stringify(videoPlayerHandler.playList) ;
            }
//            var playList = $('.playList ul');
            videoPlayerHandler.addItemToPlayListView(listItemData);

        });
} ;



videoPlayerHandler.populatePlayList = function(){
    var playPbj = localStorage.playlistObject;
    if (playPbj === undefined){
        videoPlayerHandler.playList = [];
    }else{
        videoPlayerHandler.playList = JSON.parse(playPbj);
    }
    var length = videoPlayerHandler.playList.length;
    for (var i = 0 ; i < length ; i++ ){
//        var playList = $('.playList ul');
        videoPlayerHandler.addItemToPlayListView(videoPlayerHandler.playList[i]);
    }

}

videoPlayerHandler.populateList = function(data){
//    for (video in window.youtubeListData.data.items){
    var length = data.data.items.length;
    var uList =  $('.videoList ul')[0];

    if(typeof uList === 'undefined'){
        return;
    }

    for (var i = 0 ; i < length ; i++){
        var video =     data.data.items[i];
        var listItem =  $('<li id="' + video.id +'" name="' + video.title + '"><h5>' +  video.title + '</h5>' +
            '<div class="listVideoItem"><div><img class="videoImage" src="' + video.thumbnail.hqDefault +
            '"/></div><button  class="btn add-to-playlist-button">Add</button></div></li>');
        videoPlayerHandler.addAddButtonFunctionality(listItem);
        listItem.appendTo(uList);
        listItem.data("videoData",video);
    }


}


videoPlayerHandler.addItemToPlayListView = (function(){
    var playList = null;

    return function(obj){
        playList = playList || $('.playList ul');

        var playListItem = $('<li class="playListItem"><div class="playListInner"><h5>' + obj.title +'</h5><div><img class="videoImage" src="' +
            obj.thumbnail.hqDefault + '"/></div><div class="videoImageButtonBar"><button class="btn select-video-btn">Select</button><button class="btn btn-danger remove-video-btn">Remove</button></div></div></li>');

//adding button functionality
        $(playListItem).find(".select-video-btn").click(function(){
            var listItem = $($(this).closest('li')).data("videoData");
            var embedHtml = "http://www.youtube.com/embed/" + listItem.id;
            $(".videoDisplay").attr("src",embedHtml);


        });
        $(playListItem).find(".remove-video-btn").click(function(){
            var listItem = $($(this).closest('li')).data("videoData");
            var index = videoPlayerHandler.playList.indexOf(listItem);
            if (index != -1){
                videoPlayerHandler.playList.splice(index,1);
                $(this).closest('li').remove();
                localStorage.playlistObject =  JSON.stringify(videoPlayerHandler.playList);
            }
        });
        //append to playlist
        playListItem.appendTo(playList);
        playListItem.data("videoData", obj);
    }
}())


//videoPlayerHandler.addItemToPlayListView = function(playList, obj){
//
//    var playListItem = $('<li class="playListItem"><div class="playListInner"><h5>' + obj.title +'</h5><div><img class="videoImage" src="' +
//        obj.thumbnail.hqDefault + '"/></div><div class="videoImageButtonBar"><button class="btn select-video-btn">Select</button><button class="btn btn-danger remove-video-btn">Remove</button></div></div></li>');
//
////adding button functionality
//    $(playListItem).find(".select-video-btn").click(function(){
//        var listItem = $($(this).closest('li')).data("videoData");
//        var embedHtml = "http://www.youtube.com/embed/" + listItem.id;
//        $(".videoDisplay").attr("src",embedHtml);
//
//
//    });
//    $(playListItem).find(".remove-video-btn").click(function(){
//        var listItem = $($(this).closest('li')).data("videoData");
//        var index = videoPlayerHandler.playList.indexOf(listItem);
//        if (index != -1){
//            videoPlayerHandler.playList.splice(index,1);
//            $(this).closest('li').remove();
//            localStorage.playlistObject =  JSON.stringify(videoPlayerHandler.playList);
//        }
//    });
//    //append to playlist
//    playListItem.appendTo(playList);
//    playListItem.data("videoData", obj);
//
//}

//run after  DOM (document) ready
$(function(){
    videoPlayerHandler.init();
})
