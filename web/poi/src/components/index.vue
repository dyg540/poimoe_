<template>
    
    <div style="">

        <loading v-show="isHotTagsLoaded == false && isRecomendedLoaded == false && isHotThemesLoaded == false"></loading>

        <div v-show="isHotTagsLoaded == true && isRecomendedLoaded == true && isHotThemesLoaded == true" class="row a-bounceinT" style="border-bottom: 1px solid rgb(220, 220, 220)">

            <div class="col-md-10 col-md-offset-1" style="padding-top:15px;padding-bottom:15px;">

                <div class="col-md-6" id="slider">
                    <carousel>
                      <slider>
                        <img width="100%" src="http://i2.hdslb.com/u_user/f228d91bec1cce6cb2d0f08c71a7b32f.jpg">
                          <div class="carousel-caption">
                         </div>
                      </slider>
                      <slider>
                        <img src="http://i0.hdslb.com/u_user/b27b4638b156b62f3a3679fa40d7194d.jpg">
                      </slider>
                      <slider>
                        <img src="http://i1.hdslb.com/u_user/2f3fe2a65f5188b02e3fcd1fbd9bad14.png">
                      </slider>
                    </carousel>
                </div>

                <div class="col-md-6 hot-cg-imgs">
                    <div @click="viewThisCG(item._id)" class="col-md-4 cg-container" id="cgc-index" v-for="(key, item) in hotThemes">
                        <div v-on:mouseenter="showCover" v-on:mouseleave="hideCover" class="cg-img" style="background-image:url('{{item.image}}')">
                            <div v-show="cgReco.showCover" transition="cgrecocover" class="cg-img-cover">
                                <div class="span">{{key + 1}}</div>
                                <h4 style="line-height:4">{{item.user_id.username}}</h4>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="col-md-10 col-md-offset-1" style="padding-left:0px;padding-right:0px">
                
                <div class="row">
                    <div class="col-md-12" style="text-align:center">
                        <div class="recommend-user">
                            <div class="panel-header">
                                推荐用户
                            </div>
                            <div class="panel-section">
                                    
                                <div class="photo-group">
                                     <ul>
                                         <li v-for="user in top5Users" style="background-image:url({{user.photo | photoNullToVision}})" @click="toProfile(user._id)" title="{{user.username}}"></li>
                                     </ul>
                                     <ul>
                                         <li v-for="user in bottom5Users" style="background-image:url({{user.photo | photoNullToVision}})" @click="toProfile(user._id)" title="{{user.username}}"></li>
                                     </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">

                        <div class="hot-cg">
                            <div class="panel-header">
                                热门标签
                            </div>

                            <div class="panel-section">
                                <div class="hot-tags-content">
                                    
                                    <div class="row">
                                        <div class="col-md-6 hot-tags-section-padding" v-for="item in hotTags">
                                            <div class="hot-tags-section">
                                                <div class="hot-tags-header">
                                                    <h4>{{item.names}}</h4>
                                                </div>
                                                <div class="hot-tags-img">
                                                    <ul>
                                                        <li @click="viewThisCG(cg._id)" v-bind:class="key < 2 ? '' : 'displaynone'" v-for="(key, cg) in item.themes" style="background-image: url({{cg.image}})"></li>
                                                    </ul>
                                                    <ul>
                                                        <li @click="viewThisCG(item._id)" v-bind:class="key >= 2 ? '' : 'displaynone'" v-for="(key, cg) in item.themes" style="background-image: url({{cg.image}})"></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                    <div class="clearfix visible-xs-block"></div>
                </div>

            </div>
        </div>
    </div>

</template>

<script>

    import util from '../commons/scripts/commons.js';
    import search from './search/search.vue';
    import us from '../services/UserService.js';
    import loading from './loading/loading.vue';

    export default {
        data() {
            return {
                cgReco: {
                    showCover: false
                },
                cgIndex: {
                    showCover: false
                },
                displayNavSearch: false,
                keywordSearched: '',

                hotThemes: [],

                top5Users: [],
                bottom5Users: [],

                hotTags: [],

                isHotThemesLoaded: false,
                isHotTagsLoaded: false,
                isRecomendedLoaded: false

            }
        },

        components: {
            'search': search,
            'loading': loading
        },

        methods: {
            showCover: function() {
                this.cgReco.showCover = true;
            },

            hideCover: function() {
                this.cgReco.showCover = false;
            },

            showIndexCover: function(obj) {
                obj.target.getElementsByTagName('div')[0].setAttribute('style','opacity:1;padding-top:76px;');
            },

            hideIndexCover: function(obj) {
                obj.target.getElementsByTagName('div')[0].setAttribute('style','opacity:0;padding-top:60px;');
            },

            viewThisCG: function(id) {
                util.cancelActiveMenu();
                router.go('/view/' + id);
            },

            toProfile: function(uid) {
                util.cancelActiveMenu();
                router.go('/profile/' + uid);
            },

            loadThisSearchNav: function() {
                util.resetNavSearchSize();
                this.displayNavSearch = true;
            },

            hideThisSearchNav: function() {
                this.displayNavSearch = false;
            },

            pipeToSearchInput: function(key) {
                this.keywordSearched = key;
            },

            toSearchPage: function() {
                util.cancelActiveMenu();
                var key = this.keywordSearched;
                var route = {
                    name: 'search-key',
                    params: {
                        keywords: key
                    }
                };
                router.replace(route);
            },

            getHotThemes: function() {

                var _this = this;

                services.CGService.getHotThemes().then(function(res) {

                    var code = res.data.code;
                    var data = res.data.message;

                    if(code != 200) {
                        util.messageBox(data);
                        return false;
                    }

                    _this.hotThemes = data;
                    _this.isHotThemesLoaded = true;

                }, function(err) {
                    util.handleError(err);
                });
            },

            getRecommendUsers: function() {

                var _this = this;

                services.UserService.getRecomended().then(function(res) {

                    var code = res.data.code;
                    var data = res.data.message;

                    if(code != 200) {
                        util.messageBox(data);
                        return false;
                    }

                    for (var i = 0; i < 5; i++) {
                        var user = data[i];
                        if(typeof user != 'undefined') {
                            _this.top5Users.push(user);
                        }
                    };

                    for (var i = 5; i < data.length; i++) {
                        var user = data[i];
                        _this.bottom5Users.push(user);
                    };

                    _this.isRecomendedLoaded = true;

                }, function(err) {
                    util.handleError(err);
                });

            },

            getHotTags: function() {

                var _this = this;

                services.TagsService.getHotTags().then(function(res) {

                    var code = res.data.code;
                    var data = res.data.message;

                    if(code != 200) {
                        util.messageBox(data);
                        return false;
                    }

                    _this.hotTags = data;

                    _this.isHotTagsLoaded = true;

                    search.props.hotTags.default = data;

                }, function(err) {
                    util.handleError(err);
                });

            },

            testphpcors: function() {
                services.UserService.uploadPicture({
                    a: 'fuck'
                }).then(function(res) {
                    var code = res.data.status;
                    var message  = res.data.message;

                    if(code != 200) {
                        util.messageBox(message);
                        return false;
                    }

                    var origin = message.origin;
                    var preview = message.preview;

                }, function(err) {
                    util.handleError(err);
                });
            }
        },

        created() {
            var _this = this;

            var servicesInterval = setInterval(function() {
                if(typeof window.services != 'undefined') {

                    clearInterval(servicesInterval);

                    var slider = document.getElementById('slider');

                    if(slider != null) {

                        var sliderChildNodesItem = slider.childNodes.item(1).toString() == '[object Text]' ? slider.childNodes.item(0) : slider.childNodes.item(1);

                        console.log(slider.childNodes.item(1).toString(), slider.childNodes.item(1).toString() == '[object Text]');
                        console.log(sliderChildNodesItem);

                        var sliderInner = sliderChildNodesItem.getElementsByTagName('div');
                        var sliderItem = sliderInner[0].getElementsByTagName('div');
                        sliderItem[0].setAttribute('class', sliderItem[0].getAttribute('class') + ' active');
                    }

                    util.resetNavSearchSize();

                    _this.getHotThemes();
                    _this.getRecommendUsers();
                    _this.getHotTags();
                }
            }, 1);

        }
    };

</script>

<style>
    .nav {
        margin: 10px;
    }

    .nav li {
        display: inline-block;
        font-size: 25px;
    }

    .profile-img {
        width: 100%;
        height: 75px;
        background-image: url(http://img.t.sinajs.cn/t5/skin/public/profile_cover/015_s.jpg?version=f26b055ccf71bd78);
    }

    .profile-photo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-image: url(http://tp2.sinaimg.cn/2354504421/180/40057719478/0);
        background-size: 60px;
        cursor: pointer;
        margin: 0 auto;
        margin-top: -30px;
    }

    p {
        font-size: 1.4em!important;
        margin-bottom: 3px;
        line-height: .7;
    }

    .profile-detail {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .profile .outer-column {
        border-right: 1px solid rgb(220, 220, 220);
    }

    .profile .outer-column:last-child {
        border-right: none;
    }

    .profile .column {
        margin-bottom: 5px;
        cursor: pointer;
        text-align: center;
    }

    .profile .column:hover {
        color: rgb(0, 124, 246);
    }

    .profile .column span {
        color: rgb(170, 170, 170);
    }

    .recommend-user {
        /*border-top: 1px solid rgb(220, 220, 220);*/
    }

    .panel-header{
        padding: 2px 15px;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        border-left: 2px solid rgb(0, 124, 246);
    }

    .panel-footer {
        font-size: 14px;
    }

    .panel-section {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .media-body {
        text-align: left;
        padding-left: 10px;
    }

    .photo-group {
        display: table;
        margin: 0 auto;
    }

    .photo-group ul {
        list-style: none;
        margin-left: -40px;
        display: table-row;
    }

    .photo-group ul li {
        float: left;
        cursor: pointer;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        background-image: url(http://i0.hdslb.com/320_200/video/f2/f2b119b4270f1a7c5bf03716065d35be.jpg);
        transition: all .3s ease;
        background-position: center;
        margin: 10px;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .photo-group ul li:hover {
        transform: scale(1.04);
    }

    .cg-img {
        width: 100%;
        height: 120px;
        background-repeat: no-repeat;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
        background-position: center;
        background-size: cover;
    }

    .cg-img:hover {
        background-color: rgba(0, 0, 0, 0.4);
    }

    .cg-group .col-md-6:nth-child(odd) {
        padding-right: 6px;
    }

    .cg-group .col-md-6:nth-child(even) {
        padding-left: 6px;
    }

    .cg-img-cover {
        opacity: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        color: rgb(255, 255, 255);
        text-align: left;
        padding-left: 10px;
        font-weight: 200;
        border-radius: 4px;
    }

    .cg-img-cover .span {
        text-align: right;
        width: 100%;
        font-size: 2.4em;
        padding-right: 5px;
    }

    .cg-img-cover p {
        font-size: 1em!important;
    }

    .cg-img-cover h4 {
        font-weight: 200;
    }

    .cg-img-cover.index {
        padding-top: 60px;
    }

    .cg-img-cover.index h4 {
        margin-top: 0px;
    }

    @media screen and (max-width: 960px) {
        .photo-group ul li {
            width: 30px;
            height: 30px;
            background-size: 30px;
        }

        .img-box {
            display: flex;
            /*flex-wrap: wrap;*/
            flex-direction: column;
            flex: none;
        }

        .img-item {
            width: 100%;
        }

        .img-item2 {
            width: 100%;
        }

    }

    @media screen and (max-width: 800px) {
        .cg-container {
            padding-left: 0px;
        }

        #cgc-index {
            margin-top: 10px;
        }

        .cg-img {
            height: 320px;
        }

        .photo-group ul li {
            width: 100px;
            height: 100px;
            background-size: 100px;
        }
    }

    @media screen and (max-width: 414px) {
        .photo-group ul li {
            width: 60px;
            height: 60px;
            background-size: 60px;
        }

        div.timeline-new-section-outer {
            font-size: 11px;
        }
    }

    @media screen and (max-width: 320px) {
    
        div.new-cg-confirm button {
            margin: 10px;
            width: 100%;
        }

        div.new-cg-confirm button:nth-child(2) {
            margin-top: -25px!important;
        }

        div.new-cg-confirm button:nth-child(3) {
            margin-top: -55px!important;
        }

        div.new-cg-confirm {
            padding-right: 20px;
            margin-top: -24px;
            height:150px;
        }
    }

    @media screen and (max-width: 1023px) {
        .profile .outer-column {
            border-bottom: 1px solid rgb(220, 220, 220);
            border-right: none;
            padding-top: 5px;
            margin-bottom: 5px;
        }

        .profile .outer-column:last-child {
            border-bottom: none;
        }

        .recommend-user {
            margin-top: 0px;
        }

    }

    .cgrecocover-transition {
        transition: all .3s ease;
        opacity: 1;
    }

    .cgrecocover-enter, .cgrecocover-leave {
        padding: 0 10px;
        opacity: 0;
    }

    .img-box {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }

    .img-item {
        flex: 1;
        height: 140px;
        cursor: pointer;
        background-image: url(http://i0.hdslb.com/320_200/video/f2/f2b119b4270f1a7c5bf03716065d35be.jpg);
        /*background-size: 100% 100%;*/
        background-position: center;
    }

    .img-item2 {
        flex: 2;
    }

    .hot-tags-content {
        width: 100%;
    }

    .hot-tags-section {
        width: 100%;
        text-align: center;
        box-shadow: 0 0 1px 1px rgb(220, 220, 220);
    }

    .hot-tags-section h4 {
        font-weight: 200;
        margin-top: 0px!important;
        padding-top: 5px!important;
        margin-bottom: 5px!important;
    }

    .hot-tags-img {
        display: table;
        width: 100%;
    }

    .hot-tags-img ul {
        list-style: none;
        display: table-row;
        margin-left: -40px;
    }

    .hot-tags-img ul li {
        display: table-cell;
        border: 1px solid rgb(255, 255, 255);
        height: 220px;
        background-image: url(http://i2.hdslb.com/u_user/c143946c2acf6e34e836bd9e24871ad7.jpg);
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
    }

    .hot-tags-img ul li:hover {
        transition: all .3s ease;
        padding: 10px;
    }

    .hot-tags-section-padding {
        padding: 7px;
    }

    .hot-cg {
        /*border-left: 1px solid rgb(220, 220, 220);*/
    }

    .col-md-6 {
        padding-left: 0px;
        padding-right: 0px;
    }

    .hot-tags-content .col-md-6 {
        /*padding-left: 10px;*/
        padding-right: 15px;
    }

    .hot-cg-imgs .col-md-4 {
        padding-right: 0px!important;
        /*padding-left: 10px;*/
    }

</style>
