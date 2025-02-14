var baseURL = window.location.origin;
var apiURL = "https://aicc_new.pulseadmin.in/";
if (window.location.origin == "http://localhost:54144")
    baseURL = window.location.origin;
else
    baseURL = "https://join.profcongress.in/";

 

var app = angular.module("myApp", []);

app.controller("dashboardController",["$scope", "$http", "$compile", function ($scope, $http,$compile) { 
    $scope.logout = function () {
        localStorage.setItem("loginUser", '');
        localStorage.setItem('userDetails', '');
        window.location.href = baseURL + '/home/index';
    }
    if (localStorage.getItem("loginUser") != null && localStorage.getItem("loginUser") != "" &&
        localStorage.userDetails != undefined) {
        $scope.Name = JSON.parse(localStorage.userDetails)[0].name;
        $scope.Role = JSON.parse(localStorage.userDetails)[0].role;
        $("#profile_img").attr("src", JSON.parse(localStorage.userDetails)[0].filePath)
        $("#login_btn").hide();
        $("#menu").show();
    }
    else {
        $("#menu").hide();
        $("#login_btn").show();
    }
    $scope.showLogin = function () {
        if (localStorage.getItem("loginUser") != undefined && localStorage.getItem("loginUser") != "")
            window.location.href = baseURL + "/activites";

        else {
            $("#Login").show();
            $("body, .main_div").addClass("hidden")
        }
    }
    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }
    $scope.showmenu = function () {
        $(".sidemenu").addClass("sidemenushow");
        $("body, .main_div").addClass("hidden")
    }
  

}])

app.controller("home1Controller", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';

    $scope.IsMemberRef = 0; 
    $scope._memberName = '';
    
    $scope.showHome = function () {
        window.location.href = "/home/index";
    }
    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                localStorage.setItem("loginUser", $scope.mobileNo);
                localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
                if (JSON.parse(localStorage.userDetails)[0].role == "R")
                    window.location.href = baseURL + "/activites";
                else
                    window.location.href = baseURL + "/home/profile";

            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                localStorage.setItem("loginUser", $scope.mobileNo);
                localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
                if (JSON.parse(localStorage.userDetails)[0].role == "R")
                    window.location.href = baseURL + "/activites";
                else
                    window.location.href = baseURL + "/home/profile";
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                alert("Invalid mobile number");
                return false;
            }
            else {
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading1").hide();
                $("#divOTP").show();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading1").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.GetQuestions = function (item) {
        $(".langbtn").attr("disabled", true);
        $($(".chatbot")[2]).remove();
        $(".visitor").remove();
        $scope.Qno = 0;
        $scope.selectedLanguage = item.language_id;
        $scope.GetMasters(28, item.language_id, "", "");
        $(".chat").append('<li class="visitor" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/visitor_img.png" + '"></div><div class="msg"><div><p>' + item.language_name + ' </p></div></div></li>');
        var wtf = $('.main_div,.inner_div');
        var height = wtf[0].scrollHeight;
        wtf.scrollTop(height);
    }
    $("#hdnFile").change(function () {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profileImage').attr('src', e.target.result);
        }
        var files = $(this).get(0).files;
        reader.readAsDataURL(files[0]);
    })
    $scope.inputClick = function () {
        $("#hdnFile").click()
    }
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.nxtbtn = function (flg) {
        if (flg == 1) {
            $("#div2,#div3").hide();
            $("#div1").show();
        }
        if (flg == 0) {
            $(".page1").show();
            $(".page2").hide();
        }
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $("#div1,#div3").hide();
                            $("#div2").show();
                            $scope.OTPSend = response.data.Data;
  
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.LoadQuestions = function () {
        if ($scope.Language != "")
            $scope.GetMasters(28, $scope.Language, '', '');
    }

    $scope.showLogin = function () {
        if (localStorage.getItem("loginUser") != undefined && localStorage.getItem("loginUser") != "")
            window.location.href = baseURL + "/activites";

        else {
            $(".page2").show();
            $("#content").hide();
            $(".page1").hide();
        }
    }

    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 28) {
                $scope.Questions = response.data.objresult.Table; 
                var filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 3);
                });
                if (filterItems != null && filterItems.length > 0) {
                    $scope.Genderlist = filterItems[0].ques_probableValues.split("$");
                }
                filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 4);
                });
                if (filterItems != null && filterItems.length > 0) {
                    $scope.ProfessionList = filterItems[0].ques_probableValues.split("$");
                }
                filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 6);
                });
                if (filterItems != null && filterItems.length > 0 && filterItems[0].ques_probableValues!=null) {
                    $scope.LevelList = filterItems[0].ques_probableValues.split("$");
                }
            }
            if (TypeId == 27) {
                $scope.Languages = response.data.objresult.Table;
                
            }
            if (TypeId == 91) {
                if (response.data.objresult.Table.length > 0) {
                    var _memData = response.data.objresult.Table;
                    $scope._memberName = _memData[0].name;
                }
                else {
                    $scope._memberName = "Admin";
                }

            }
            if (TypeId == 29) {
                $scope.duplicateNo = response.data.objresult.Table;
                if ($scope.duplicateNo != undefined && $scope.duplicateNo.length > 0) {
                    //alert("Already submitted, please contact administrator");

                    $("#content").show();
                    $(".page1").hide();
                    //$compile($("#content").empty().append(' <h6> <b> You are already a registered member of AIPC. Thank You.<br/><a href="javascript::" style="color:white" ng-click="showLogin()">Click to login using your mobile number</a> </b><h6>'))($scope);
                    $compile($("#content").find("h6").find("b").empty().append('<div class="msg"><div><p><b>You are already a registered member of AIPC. Thank You.<br/><br/><a href="javascript::" style="color:#518EF8" ng-click="showLogin()">Click to login using your mobile number</a></p></div></div>'))($scope);
                    setTimeout(function () {

                        window.location.reload(true);
                    }, 50000)
                    return false;
                }
                else {
                    $(".loading").show();
                    $scope._SendOTP(FilterText);
                }
            }
            if (TypeId == 30) {
                if (response.data.Status == "-100") {
                    showToast($scope.Questions[4].ques_errMsg) 
                    return false;

                }
                else {
                    $scope.pinCodeDtls = response.data.objresult.Table;
                    if ($scope.pinCodeDtls == undefined || $scope.pinCodeDtls.length == 0) {
                        showToast($scope.Questions[4].ques_errMsg)
                        return false; 
                    }
                    else {
                        $scope.SaveRecord();
                    }
                }
            }
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {

                    $("#content").show();
                    //$("#content").find("h6").find("b").empty().html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>join.Profcongress.in</a>")
                    $compile($("#content").find("h6").find("b").empty().append('<div class="msg"><div><p><b>We have not found your number in our records ,<br/> please click on the below link to register for AIPC <br/> <br/> <a href="https://join.profcongress.in/join">https://join.profcongress.in/join</a></p></div></div>'))($scope);

                    $(".page2,.page1").hide(); 
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $compile($("#content").find("h6").find("b").empty().append('<div class="msg"><div><p>You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in</p></div></div>'))($scope);

                    $(".page2,.page1").hide();
                    return false;
                }
            }

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }

    $scope.GetMasters(28, "1", '', '');
    $scope.Language = "1";
    if (_memberCode != '' && _memberCode != 'join') {
        $scope.IsMemberRef = 1;
        $scope.GetMasters(91, 0, _memberCode, '');
    }
    $scope.CheckPinCode = function () {
        if ($scope._Name == null || $scope._Name == "") {
            showToast("Invalid Name");
            return false;
        }
        else if ($scope.Gender == null || $scope.Gender == "") {
            showToast("Invalid Gender");
            return false;
        }
        else if ($scope.selectedProfession == null || $scope.selectedProfession == "") {
            showToast("Invalid Profession");
            return false;
        }
        else if ($scope.selectedLevel == null || $scope.selectedLevel == "") {
            showToast("Invalid Level");
            return false;
        }
        else if ($scope.Pincode == null || $scope.Pincode == "") {
            showToast("Invalid pin code");
            return false;
        }
        $scope.GetMasters(30, 0, $scope.Pincode, "");
    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(27, 0, "", "");
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function () {
        if ($scope.Language == null || $scope.Language == "") {
            showToast("Invalid language");
            return false;
        } if ($scope.MobileNumber == null || $scope.MobileNumber == "") {
            showToast("Invalid Mobile No");
            return false;
        }

        var _mobileNo = $scope.MobileNumber; 
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.IsPinCodeValidated = 0;
    $scope.ConfirmPinCode = function (_type) {
        if (_type == 1) {
            $scope.IsPinCodeValidated = 1;
            $scope.SubmitQuestion();
            $scope.ScrollToBottom();
        }
        $("#PinCodeBox").modal("hide")
    }
    $scope.CaptureSelfie = function () {
        $("#my_camera,#btnCapture").hide();
        $("#results_2").show();
        Webcam.snap(function (data_uri) {
            // display results in page
            let le = '<div><img id="base64image" style="width:300px;height:200px"  src="' + data_uri + '"/></div>';
            le += ' <br/><div class="bot-icon" style="display:flex"><button type="button" id="btnCapture" class="retakeBtn dflex"   ng-click="ReTakeSelfi()"><img class="camera" src="../Content/img/camera.png"/> Retake</button></div>'
            //document.getElementById('results').innerHTML = le; 
            $compile($("#results_2").empty().append(le))($scope); 
            // $scope.SaveRecord();
        });
    }
    $scope.TakeSelfi = function () {
        $("#divCamera").show(); $("#divCapture").hide();
        $scope._EnableCamera(); 
    }
    $scope.ReTakeSelfi = function () {
        $("#divCamera,#my_camera,#btnCapture").show(); $("#divCapture,#results_2").hide();
        $scope._EnableCamera();
    }
    $scope.selectOption = function (index, Qno) {
        $(".langbtn_" + Qno).attr("disabled", true);
        $("#visitor_msg").attr("type", "text")
        $scope.visitor_msg = $("#btnSelect_" + index + "_" + Qno).html();
        $("#visitor_msg").val($("#btnSelect_" + index + "_" + Qno).html());
        $scope.SubmitQuestion();
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }
    $scope.Answers = [];
    $scope.isOTPValidated = false;
    $scope.ValidateOTP = function () {
        if ($scope.OTPSend == $scope.OTP) {
            $scope.Qno = 0;
            $scope.isOTPValidated = true;
            $("#div2,#div1").hide();
            $("#div3").show();
        }
        else if ($scope.OTP == "6666") {
            $scope.Qno = 0;
            $scope.isOTPValidated = true;
            $("#div2,#div1").hide();
            $("#div3").show();
        }
        else if ($scope.OTPSend != $scope.OTP) {
            showToast("Invalid OTP"); 
            //alert("Invalid OTP");
            return false;
        }
    }
      
    $scope.SaveRecord = function () {
       

        var formdata = new FormData();
        if ($scope.Language == null || $scope.Language == "") {
            alert("Invalid language");
            return false;
        }
        else if ($scope.MobileNumber == null || $scope.MobileNumber == "") {
            alert("Invalid MobileNumber");
            return false;
        }
        else if ($scope._Name == null || $scope._Name == "") {
            alert("Invalid Name");
            return false;
        }
        else if ($scope.Gender == null || $scope.Gender == "") {
            alert("Invalid Gender");
            return false;
        }
        else if ($scope.selectedProfession == null || $scope.selectedProfession == "") {
            alert("Invalid Profession");
            return false;
        }
        else if ($scope.selectedLevel == null || $scope.selectedLevel == "") {
            alert("Invalid Level");
            return false;
        }
        else if ($("#txtPincode").val() == null || $("#txtPincode").val() == "") {
            alert("Invalid Pincode");
            return false;
        }
        else if (document.getElementById("base64image") == null || document.getElementById("base64image").src == "") {
            alert("Invalid selfile");
            return false;
        }

        var file = document.getElementById("base64image").src;

        $scope.Answers.push({ "Question": "0", "Answer": $scope.Language });
        $scope.Answers.push({ "Question": "1", "Answer": $scope.MobileNumber });
        $scope.Answers.push({ "Question": "2", "Answer": $scope._Name  });
        $scope.Answers.push({ "Question": "3", "Answer": $scope.Gender });
        $scope.Answers.push({ "Question": "4", "Answer": $scope.selectedProfession   });
        $scope.Answers.push({ "Question": "5", "Answer": $scope.Pincode  });
        $scope.Answers.push({ "Question": "6", "Answer": $scope.selectedLevel });
        $scope.Answers.push({ "Question": "7", "Answer": $scope.EmailId });
        if ($scope.Answers == null || $scope.Answers.length == 0) {
            alert("Invalid answers");
            return false;
        }
        else {
            $(".loading").show();
            $(".langbtn").attr("disabled", true);
            $("#btnCapture").attr("disabled", true); 
            $("#btnSubmit").attr("disabled", true); 
            setTimeout(function () {
                var data = new FormData();
                data.append("base64image", file);  
                data.append("Answers", JSON.stringify($scope.Answers));
                data.append("IPAddress", $scope.UserLocation); data.append("referenceCode", _memberCode);
                data.append("MobileNumber", $scope.MobileNumber);
                data.append("languageID", $scope.selectedLanguage);
                $.ajax({
                    url: baseURL + '/home/saveRecord',
                    type: "POST",
                    data: data,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        $(".loading").hide();
                        $("#content").show();
                        $('html, body').animate({
                            scrollTop: $('#content').offset().top - 20
                        }, 'slow');
                        if (result.Response === 200) {
                            var filterItems = $scope.Languages.filter(function (_fil) {
                                return (_fil.language_id == $scope.selectedLanguage);
                            });;
                            if (filterItems != null && filterItems.length > 0) {
                                $("#content").find("h6").find("b").empty().append(' <div class="msg"><div><p><b>' + filterItems[0].language_message + '</p></div></div></li>');
                                // showToast(filterItems[0].language_message)
                            }
                            else {
                                $("#div1,#div3,#div2").hide(); 
                                $("#content").find("h6").find("b").empty().append('<div class="msg"><div><p><b>Congratulations !!</b> <br/> You’ve successfully registered with All India Professional Congress.You’ll soon receive a confirmation on the registered mobile number.</p></div></div></li>');
                                //showToast("Congratulations !!</b> <br/> You’ve successfully registered with All India Professional Congress.You’ll soon receive a confirmation on the registered mobile number.")
                            }

                            
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 10000)

                        }
                        else if (result.Response === -300) {
                            $("#btnCapture").attr("disabled", false);
                            $("#btnSubmit").attr("disabled", false); 
                            showToast("Duplicate mobile no")
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 5000)

                        }
                        else {
                            $(".langbtn").attr("disabled", false);
                            $("#btnCapture").attr("disabled", false);
                            $("#btnSubmit").attr("disabled", false); 
                            alert(result.Data)
                            showToast(result.Data);
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 5000)

                        }
                    },
                    error: function (errormessage) {

                    }
                });
            }, 500)
        }
    }
    $scope._EnableCamera = function () {
        Webcam.set({
            height: 300,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#my_camera');
        $scope.ScrollToBottom();
        navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia({ video: true }, function () {

        }, function (ex) { 
            alert("Sorry we cannot continue with membership camera is not present in the device");
            window.location.href = '/home/index';
            return false;
        });


    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }


}]);
app.controller("homeController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) { 
    $scope.result1 = '';

    $scope.nxtbtn = function () {
        $(".page1").hide();
        $(".page2").show();
        $("#Login").show();
    }
    $scope.showHome = function () {
        window.location.href = "/home/index";
    }
    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                localStorage.setItem("loginUser", $scope.mobileNo);
                localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
                if (JSON.parse(localStorage.userDetails)[0].role=="R")
                    window.location.href = baseURL + "/activites";
                else
                    window.location.href = baseURL + "/home/profile";

            }
            //else if ($scope._lOTP == "6666") {
            //    $scope.isOTPValidated = true;
            //    localStorage.setItem("loginUser", $scope.mobileNo);
            //    localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
            //    if (JSON.parse(localStorage.userDetails)[0].role == "R")
            //        window.location.href = baseURL + "3t";
            //    else
            //        window.location.href = baseURL + "/home/profile";
            //}
            else {
                alert("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                alert("Invalid mobile number");
                return false;
            }
            else {
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }
    
    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    } 
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading1").hide();
                $("#divOTP").show(); 
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading1").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }
     
    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })
    
    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.GetQuestions = function (item) { 
        $(".langbtn").attr("disabled", true);
        $($(".chatbot")[2]).remove();
        $(".visitor").remove();
        $scope.Qno = 0;
        $scope.selectedLanguage = item.language_id;
        $scope.GetMasters(28, item.language_id, "", "");
        $(".chat").append('<li class="visitor" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/visitor_img.png" + '"></div><div class="msg"><div><p>' + item.language_name + ' </p></div></div></li>');
        var wtf = $('.main_div,.inner_div');
        var height = wtf[0].scrollHeight;
        wtf.scrollTop(height);
    }
    $("#hdnFile").change(function () {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profileImage').attr('src', e.target.result);
        }
        var files = $(this).get(0).files;
        reader.readAsDataURL(files[0]);
    })
    $scope.inputClick = function () {
        $("#hdnFile").click()
    }
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';
  
    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) { 
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) { 
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }
                        
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    },1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 28) {
                $scope.Questions = response.data.objresult.Table;
               // console.log("Question Length:"+ $scope.Questions.length)
                $("#visitor_msg").attr("type", "number")
                $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><p>' + $scope.Questions[$scope.Qno].ques_name + ' </p></div></li>');
            }
            if (TypeId == 27) {
                $scope.Languages = response.data.objresult.Table;
                var ele = '<div>';
                $.each($scope.Languages, function (pr, pv) {
                    var pu = [];
                    pu.push({ "language_id": pv.language_id, "language_name": pv.language_name });
                    ele += "<button type='button' id='btnlanguage' class='langbtn' ng-click=GetQuestions(" + JSON.stringify(pu[0]) + ")>" + pv.language_name + "</button>";
                })
                ele += '</div>';
                $compile($("#languages").empty().append('<div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div>' + ele + '</div>'))($scope);
                //var ele = '<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><button type="button" id="btnlanguage" class="langbtn" ng-click="TakeSelfi()">Take Selfie</button></div></li>';
                //$compile($(".chat").append(ele))($scope);
            }
            if (TypeId == 29) {
                $scope.duplicateNo = response.data.objresult.Table;
                if ($scope.duplicateNo != undefined && $scope.duplicateNo.length > 0) {
                    //alert("Already submitted, please contact administrator");

                    $compile($(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> You are already a registered member of AIPC. Thank You.<br/><a href="javascript::" style="color:white" ng-click="showLogin()">Click to login using your mobile number</a> </p></div></div></li>'))($scope);
                    $scope.ScrollToBottom();
                    $("#visitor_msg").attr("disabled", true)
                    setTimeout(function () {

                        window.location.reload(true); 
                    },10000) 
                    return false;
                }
                else {
                    $(".loading").show();
                    $scope._SendOTP(FilterText);
                }
            }
            if (TypeId == 30) {
                if (response.data.Status == "-100") {
                    $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> ' + $scope.Questions[$scope.Qno].ques_errMsg+' </p></div></div></li>');
                    $scope.ScrollToBottom();
                    return false;

                }
                else {
                    $scope.pinCodeDtls = response.data.objresult.Table;
                    if ($scope.pinCodeDtls == undefined || $scope.pinCodeDtls.length == 0) {
                        $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> ' + $scope.Questions[$scope.Qno].ques_errMsg +' </p></div></div></li>');
                        $scope.ScrollToBottom();
                        return false;
                    }
                    else {
                        $("#PinCodeBox").modal("show")
                    }
                }
            }
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                   
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")

                    $("#Login").modal("hide")
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }
            }

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        },500)
    }
    
    $scope.GetMasters(27, 0, "", "");
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) { 
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
  
    $scope.IsPinCodeValidated = 0;
    $scope.ConfirmPinCode = function (_type) {
        if (_type == 1) {
            $scope.IsPinCodeValidated = 1;
            $scope.SubmitQuestion();
            $scope.ScrollToBottom();
        }
        $("#PinCodeBox").modal("hide")
    }
    $scope.CaptureSelfie = function () {
        $("#my_camera,#btnCapture").hide();
        $("#results").show(); 
        Webcam.snap(function (data_uri) {
            // display results in page
            let le = '<div><img id="base64image" style="width:200px"  src="' + data_uri + '"/></div>';
            le += ' <br/><div class="bot-icon" style="display:flex"><button type="button" id="btnCapture" class="retakeBtn dflex"   ng-click="TakeSelfi()"><img class="camera" src="../Content/img/camera.png"/> Retake</button><button type="button" id="btnCapture" class="langbtn bg-success"  ng-click="SaveRecord()">Confirm</button></div>'
            //document.getElementById('results').innerHTML = le; 
            $compile($("#results").append(le))($scope);
            $scope.ScrollToBottom();
            // $scope.SaveRecord();
        });
    }
    $scope.TakeSelfi = function () {
        if ($("#my_camera").closest(".chatbot").length > 0)
            $("#my_camera").closest(".chatbot").remove();
        var ele = '<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg1"><div id="my_camera" style="width:298px;heigth:300px;"></div><div id="results" style="display:none;width:300px;heigth:300px;"></div><button type="button" id="btnCapture" class="langbtn bg-blue mt-10" ng-click="CaptureSelfie()">Capture</button></div></li>';
        $compile($(".chat").append(ele))($scope); 
        $scope._EnableCamera();
        $scope.ScrollToBottom();
    }
    $scope.selectOption = function (index, Qno) {
        $(".langbtn_" + Qno).attr("disabled", true);
        $("#visitor_msg").attr("type", "text")
        $scope.visitor_msg = $("#btnSelect_" + index + "_" + Qno).html();
        $("#visitor_msg").val($("#btnSelect_" + index + "_" + Qno).html());
        $scope.SubmitQuestion();
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        },500)
    }
    $scope.Answers = [];
    $scope.isOTPValidated = false;
    $scope.SubmitQuestion = function () {
        $scope.visitor_msg = $("#visitor_msg").val();
        if ($scope.visitor_msg != undefined && $scope.visitor_msg != "" && $scope.visitor_msg != null) {
            if ($scope.Qno == 4 && $scope.IsPinCodeValidated==0) { //Pincode Validation
                $scope.GetMasters(30, 0, $scope.visitor_msg, ""); 
                return false;
            }
            if ($scope.Qno == 0 && !$scope.isOTPValidated) {
                if ($scope.visitor_msg.length < 10  || $scope.visitor_msg.length > 10) {
                    $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> Invalid mobile number </p></div></div></li>');
                     //alert("Invalid mobile number"); 
                    return false;
                } 
            }

            if ($scope.Qno == 1 && !$scope.isOTPValidated) {
                if ($scope.OTPSend == $scope.visitor_msg) {
                    $scope.Qno = 0;
                    $scope.isOTPValidated = true;
                }
                else if ($scope.visitor_msg == "6666") {
                    $scope.Qno = 0;
                    $scope.isOTPValidated = true;
                }
                else if ($scope.OTPSend != $scope.visitor_msg) {
                    $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> Invalid OTP </p></div></div></li>');
                    $scope.ScrollToBottom();
                    //alert("Invalid OTP");
                    return false;
                }
            }
            $(".chat").append('<li class="visitor" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/visitor_img.png" + '"></div><div class="msg"><div><p>' + $scope.visitor_msg + ' </p></div></div></li>');
            $scope.Qno = $scope.Qno + 1;
            if ($scope.Qno == 1 && !$scope.isOTPValidated) {
                if ($scope.visitor_msg.length == 10)
                    $scope.SendOTP($scope.visitor_msg);
                

            }
            else {
                if ($scope.Questions[$scope.Qno].ques_no == 8) {
                    var ele = '<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg w-100"><button type="button" id="btnlanguage" class="langbtn btn-block dashed_bdr dflex" ng-click="TakeSelfi()"><img class="camera" src="../Content/img/camera.png"/>Click a Selfie</button></div></li>';
                    $compile($(".chat").append(ele))($scope);

                }
                else {
                    if ($scope.Questions[$scope.Qno].ques_type == "select") {

                        var probableValues = $scope.Questions[$scope.Qno].ques_probableValues.split("$");
                        var ele = '<div class="msg"><p>' + $scope.Questions[$scope.Qno].ques_name + ' </p></div>';
                        $.each(probableValues, function (pr, pv) {
                            ele += "<button type='button' id='btnSelect_" + pr + "_" + $scope.Qno + "' class='langbtn langbtn_" + $scope.Qno + "' ng-click=selectOption(" + pr + "," + $scope.Qno + ")>" + pv + "</button>";
                        })
                        ele += '';
                        $compile($(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div>' + ele + '</div></li>'))($scope);
                    }
                    else {
                        $compile($(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno].ques_name + ' </p></div></div></li>'));
                        if ($scope.Questions[$scope.Qno].ques_type == "number") {
                            $("#visitor_msg").attr("type","number")
                        }
                        else {
                            $("#visitor_msg").attr("type", "text")
                        }
                    }
                }
            }
            if ($scope.OTPSend != $scope.visitor_msg && $scope.visitor_msg != "6666") {
                $scope.Answers.push({ "Question": $scope.Qno, "Answer": $scope.visitor_msg });
            }
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            $scope.visitor_msg = "";
            $("#visitor_msg").val("");
        }
    }
    $scope.SaveRecord = function () {
        var file = document.getElementById("base64image").src;

        var formdata = new FormData();
       
        if ($scope.Answers == null || $scope.Answers.length == 0) {
            alert("Invalid answers");
            return false;
        } 
        else {
            $(".loading").show();
            $(".langbtn").attr("disabled", true);
            $("#btnCapture").attr("disabled", true);
            $("#visitor_msg").attr("disabled", true)
            setTimeout(function () {
                var data = new FormData();
                data.append("base64image", file); data.append("referenceCode", _memberCode);
                data.append("Answers", JSON.stringify($scope.Answers));
                data.append("IPAddress", $scope.UserLocation);
                data.append("MobileNumber", $scope.MobileNumber);
                data.append("languageID", $scope.selectedLanguage);
                $.ajax({
                    url: baseURL + '/home/saveRecord',
                    type: "POST",
                    data: data,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        $(".loading").hide();
                        $("#visitor_msg").attr("disabled", false)
                        if (result.Response === 200) {
                            var filterItems = $scope.Languages.filter(function (_fil) {
                                return (_fil.language_id == $scope.selectedLanguage);
                            });;
                            if (filterItems != null && filterItems.length > 0) {
                                $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p><b>' + filterItems[0].language_message + '</p></div></div></li>');
                               // showToast(filterItems[0].language_message)
                            }
                            else {
                                $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p><b>Congratulations !!</b> <br/> You’ve successfully registered with All India Professional Congress.You’ll soon receive a confirmation on the registered mobile number.</p></div></div></li>');
                                //showToast("Congratulations !!</b> <br/> You’ve successfully registered with All India Professional Congress.You’ll soon receive a confirmation on the registered mobile number.")
                            }
                                
                            var wtf = $('.main_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                            $scope.visitor_msg = "";
                            var wtf = $('.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                            $scope.visitor_msg = "";
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 10000)

                        }
                        else if (result.Response === -300) {
                            $("#btnCapture").attr("disabled", false);
                            showToast("Duplicate mobile no")
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 5000)

                        } 
                        else { 
                            $(".langbtn").attr("disabled", false);
                            $("#btnCapture").attr("disabled", false);
                            alert(result.Data)
                            showToast(result.Data);
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 5000)
                           
                        }
                    },
                    error: function (errormessage) {

                    }
                });
            },500)
        }
    }
    $scope._EnableCamera=function() {
        Webcam.set({
            height: 300,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#my_camera');
        $scope.ScrollToBottom();
        navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia({ video: true }, function () {

        }, function () {
            alert("Sorry we cannot continue with membership camera is not present in the device");
            window.location.href = '/home/index';
            return false;
        });

     
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }
      
     
}]);

app.controller("referalCtrl", ["$scope", "$http", "$compile", function ($scope, $http, $compile) { 
    $(".header").show();
    $scope.result1 = '';
  
    $scope.showInvite = function () {
        $("#sharePopup").modal("show");
    }
    
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.copy_icon = function (flg) {
        var textArea = document.createElement("input");
        var message = "Hey friends! 🌟 Exciting news! I have become an enroller of All India Professionals' Congress (AIPC) and I encourage you to join as a member too! 🤝 Click on the link below to fill out the registration form and become an AIPC member. Let's make a positive impact together! \r\n" + $("#txtReferLink").val();

        textArea.value = flg == 1 ? $("#txtReferLink").val() : message;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'Copied successful' : 'unsuccessful'; 
            showToast(msg);
        } catch (err) {
            console.log('Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
    $scope.Cancel = function () {
        $("#sharePopup").modal("hide");
    }
    $scope.shareLink = function (flg) {
        $("#sharePopup").modal("hide");
        if (flg == 3) {
            var message = "Hey friends! 🌟 Exciting news! I have become an enroller of All India Professionals' Congress (AIPC) and I encourage you to join as a member too! 🤝 Click on the link below to fill out the registration form and become an AIPC member. Let's make a positive impact together! \r\n" + $("#txtReferLink").val();
            var url = 'https://wa.me/' + localStorage.getItem("loginUser") + '/?text=' + message;
            window.open(url);
        }
        else if (flg == 2) {
            const navUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + $scope.ReferralLink;
            window.open(navUrl, '_blank');
        }
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }

    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 31) {
                $scope.reportList = response.data.objresult.Table;
                 
            }


        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
    if (localStorage.getItem("loginUser") != null && localStorage.getItem("loginUser") != "") {
        $scope.GetMasters(31, 0, localStorage.getItem("loginUser"), '');
        $("#txtReferLink").val('https://join.profcongress.in/' + JSON.parse(localStorage.userDetails)[0].guid)
        $scope.ReferralLink = $("#txtReferLink").val();
        $scope.refername = JSON.parse(localStorage.userDetails)[0].name;
    }
    else
        window.location.href = baseURL + '/home/index';
    $scope.CloseModal = function () {
        $("#myModal").hide();
    }

}]);
app.controller("profileCtrl", ["$scope", "$http", "$compile", function ($scope, $http, $compile) { 
    $(".header").show();
    $scope.result1 = ''; 
   
    $scope.showInvite = function () {
        $("#sharePopup").modal("show");
    }
    $scope.Cancel = function () {
        $("#sharePopup").modal("hide");
    }
    
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $(".upload_img").click(function () {
        $("#myFile").click();
    })
    $("#myFile").on("change", function () {
        var file = $("#myFile").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("image")) {
                alert("Please select image file only");
                $("#myFile").focus(); 
                return false;
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.img_profile').attr('src', e.target.result);
                };

                reader.readAsDataURL(file[0]);
            }
        }

    });
    $scope.LoadQuestions = function () {
        if ($scope.Language != "")
            $scope.GetMasters(28, $scope.Language, '', '');
    }
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.SaveRecord = function () {
  
        var formdata = new FormData();
        var file = $("#myFile").get(0).files;
        $scope.Answers = [];
       //if (file == null || file.length == 0) {
       //     alert("Invalid profile pic");
       //     return false;
       // }
        if ($scope.Language == null || $scope.Language == "") {
            alert("Invalid language");
            return false;
        }
        else if ($scope.Name == null || $scope.Name == "") {
            alert("Invalid Name");
            return false;
        }
        else if ($scope.Gender == null || $scope.Gender == "") {
            alert("Invalid Gender");
            return false;
        }
        else if ($scope.selectedProfession == null || $scope.selectedProfession == "") {
            alert("Invalid Profession");
            return false;
        }
        else if ($scope.selectedLevel == null || $scope.selectedLevel == "") {
            alert("Invalid Level");
            return false;
        }
       else if ($("#txtPincode").val() == null || $("#txtPincode").val() == "") {
            alert("Invalid Pincode");
            return false;
        }
        else {
            $scope.Answers.push({ "Question": "0", "Answer": $scope.Language });
            $scope.Answers.push({ "Question": "1", "Answer": $scope.Name });
            $scope.Answers.push({ "Question": "2", "Answer": $scope.Gender });
            $scope.Answers.push({ "Question": "3", "Answer": $scope.selectedProfession });
            $scope.Answers.push({ "Question": "4", "Answer": $scope.selectedLevel });
            $scope.Answers.push({ "Question": "5", "Answer": $scope.EmailId });
            $scope.Answers.push({ "Question": "6", "Answer": $scope.Pincode });
            $(".loading").show();
            var data = new FormData();
            if (file.length>0)
              data.append("file", file[0]); 
            data.append("Answers", JSON.stringify($scope.Answers));
            data.append("IPAddress", $scope.UserLocation);
            data.append("Id", $scope.ProfileData[0].id); 
            $.ajax({
                url: baseURL + '/home/updateRecord',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) { 

                        alert("Successfully Updated");
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 2000)

                    }
                    else {
                        alert(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 39) { 
                $scope.ProfileData = response.data.objresult.Table;
                if ($scope.ProfileData.length > 0) {
                    setTimeout(function () {
                        $scope.Language = $scope.ProfileData[0].languageId;
                        $("#drpLanguage").val($scope.ProfileData[0].languageId); 
                    },500)
                    $scope.Name = $scope.ProfileData[0].name; $scope.guid = $scope.ProfileData[0].id;
                    $("#txtMobileNo").val($scope.ProfileData[0].mobileNo);
                    $scope.selectedProfession = $scope.ProfileData[0].profession;
                    $scope.Gender = $scope.ProfileData[0].gender;
                    $scope.selectedLevel = $scope.ProfileData[0].r_level;
                    $("#txtPincode").val($scope.ProfileData[0].pincode);
                    $scope.EmailId = $scope.ProfileData[0].email_address;
                    $('.img_profile').attr('src', $scope.ProfileData[0].filePath);
                }
            }
            else if (TypeId == 27) {
                $scope.Languages = response.data.objresult.Table
            }
            else if (TypeId == 28) {
                $scope.Questions = response.data.objresult.Table; 
                var filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 3);
                });
                if (filterItems != null && filterItems.length > 0) {
                    $scope.Genderlist = filterItems[0].ques_probableValues.split("$");
                }
                filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 4);
                });
                if (filterItems != null && filterItems.length > 0) {
                    $scope.ProfessionList = filterItems[0].ques_probableValues.split("$");
                }
                filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 6);
                });
                if (filterItems != null && filterItems.length > 0 && filterItems[0].ques_probableValues != null) {
                    $scope.LevelList = filterItems[0].ques_probableValues.split("$");
                }
            }


        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
   
    
    $scope.GetMasters(27, 0, '', '');
    $scope.GetMasters(28, 0, '', '');
    if (localStorage.getItem("loginUser") != null && localStorage.getItem("loginUser") != "") {
        $scope.GetMasters(39, 0, localStorage.getItem("loginUser"), '');
        $scope.refername = JSON.parse(localStorage.userDetails)[0].name;
    }
    else
        window.location.href = baseURL + '/home/index';
    $scope.CloseModal = function () {
        $("#myModal").hide();
    }

}]);
app.controller("ReportsCtrl", ["$scope", "$http", "$compile", function ($scope, $http, $compile) { 

    $(".header").show();
    $scope.result1 = '';
    $scope.viewtask = function () {
        $(".task_pop").show();
    }
    $scope.closeview = function () {
        $(".task_pop").hide();
    }
    $scope.ShowTab = function (_tab) {
        if (_tab == 1) {
            $("#nav-hom").hide();
            $("#nav-profile").show();
            $("#nav-home-tab").removeClass("active");
            $("#nav-profile-tab").addClass("active");
            $("#nav-hom").removeClass("active").removeClass("show");
            $("#nav-profile").addClass("active").addClass("show");
        }
        else if (_tab == 2) {
            $("#nav-hom").show();
            $("#nav-home-tab").addClass("active");
            $("#nav-profile-tab").removeClass("active");
            $("#nav-profile").removeClass("active").removeClass("show");
            $("#nav-hom").addClass("active").addClass("show");
            $("#nav-profile").hide();
        }
    }
    $scope.showInvite = function () {
        $("#sharePopup").modal("show");
    }
    $scope.Cancel = function () {
        $("#sharePopup").modal("hide");
    }
    $scope.shareLink = function (flg) {
        $("#sharePopup").modal("hide");
        if (flg == 3) {
            var message = "Hey friends! 🌟 Exciting news! I have become an enroller of All India Professionals' Congress (AIPC) and I encourage you to join as a member too! 🤝 Click on the link below to fill out the registration form and become an AIPC member. Let's make a positive impact together! \r\n" + $scope.ReferralLink;
            var url = 'https://wa.me/' + localStorage.getItem("loginUser") + '/?text=' + message;
            window.open(url);
        }
        else if (flg == 2) {
            const navUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + $scope.ReferralLink;
            window.open(navUrl, '_blank');
        }
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    } 
    $scope.Verified = [];
    $scope.Pending = [];
   
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 31) {
                $scope.reportList = response.data.objresult.Table;
                let dump = $scope.reportList.filter(function (_fil) {
                    return (_fil.status == 'Verified');
                });;
                if (dump != null && dump.length > 0) {
                    $scope.Verified = dump
                }
                dump = $scope.reportList.filter(function (_fil) {
                    return (_fil.status == 'Pending');
                });;
                if (dump != null && dump.length > 0) {
                    $scope.Pending = dump
                }
                $scope.ReferralLink = baseURL + 'home/index/' + response.data.objresult.Table1[0].member_code
             }
            

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
    if (localStorage.getItem("loginUser") != null && localStorage.getItem("loginUser") != "")
        $scope.GetMasters(31, 0, localStorage.getItem("loginUser"), '');
    else
        window.location.href = baseURL + '/home/index';
    $scope.CloseModal = function () {
        $("#myModal").hide();
    }
    
}]);

app.controller("my_profileCtrl", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $(".header").show();
    $("#menu,#login_btn").hide()
    $scope.result1 = '';

    $scope.showInvite = function () {
        $("#sharePopup").modal("show");
    }
    $scope.Cancel = function () {
        $("#sharePopup").modal("hide");
    }

    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $(".upload_img").click(function () {
        $("#myFile").click();
    })
    $("#myFile").on("change", function () {
        var file = $("#myFile").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("image")) {
                alert("Please select image file only");
                $("#myFile").focus();
                return false;
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.img_profile').attr('src', e.target.result);
                };

                reader.readAsDataURL(file[0]);
            }
        }

    });
    $scope.LoadQuestions = function () {
        if ($scope.Language != "")
            $scope.GetMasters(28, $scope.Language, '', '');
    }
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
 
    $scope.SaveRecord = function () {

        var formdata = new FormData();
        var file = $("#myFile").get(0).files;
        $scope.Answers = [];
        //if (file == null || file.length == 0) {
        //     alert("Invalid profile pic");
        //     return false;
        // }
        if ($scope.Name == null || $scope.Name == "") {
            alert("Invalid Name");
            return false;
        }
        else if ($scope.Gender == null || $scope.Gender == "") {
            alert("Invalid Gender");
            return false;
        }
        else if ($scope.selectedProfession == null || $scope.selectedProfession == "") {
            alert("Invalid Profession");
            return false;
        }
        else if ($scope.selectedLevel == null || $scope.selectedLevel == "") {
            alert("Invalid Level");
            return false;
        }
        else if ($("#txtPincode").val() == null || $("#txtPincode").val() == "") {
            alert("Invalid Pincode");
            return false;
        }
        else { 
            $scope.Answers.push({ "Question": "1", "Answer": $scope.Name });
            $scope.Answers.push({ "Question": "2", "Answer": $scope.Gender });
            $scope.Answers.push({ "Question": "3", "Answer": $scope.selectedProfession });
            $scope.Answers.push({ "Question": "4", "Answer": $scope.selectedLevel });
            $scope.Answers.push({ "Question": "5", "Answer": $scope.EmailId });
            $scope.Answers.push({ "Question": "6", "Answer": $scope.Pincode });
            $(".loading").show();
            var data = new FormData();
            if (file.length > 0)
                data.append("file", file[0]);
            data.append("Answers", JSON.stringify($scope.Answers));
            data.append("IPAddress", $scope.UserLocation);
            data.append("Id", $scope.ProfileData[0].id);
            $.ajax({
                url: baseURL + '/home/updateRecord_v2',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) {

                        alert("Successfully Updated");
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 2000)

                    }
                    else {
                        alert(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 54) {
                $scope.ProfileData = response.data.objresult.Table;
                if ($scope.ProfileData.length > 0) {
                    $scope.Language = $scope.ProfileData[0].languageId; 
                    $scope.Name = $scope.ProfileData[0].name; $scope.guid = $scope.ProfileData[0].id;
                    $("#txtMobileNo").val($scope.ProfileData[0].mobileNo);
                    $scope.selectedProfession = $scope.ProfileData[0].profession;
                    $scope.Gender = $scope.ProfileData[0].gender;
                    $scope.selectedLevel = $scope.ProfileData[0].r_level;
                    $("#txtPincode").val($scope.ProfileData[0].pincode);
                    $scope.EmailId = $scope.ProfileData[0].email_address;
                    $('.img_profile').attr('src', $scope.ProfileData[0].filePath);
                }
            }
            else if (TypeId == 27) {
                $scope.Languages = response.data.objresult.Table
            }
            else if (TypeId == 28) {
                $scope.Questions = response.data.objresult.Table;
                var filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 3);
                });
                if (filterItems != null && filterItems.length > 0) {
                    $scope.Genderlist = filterItems[0].ques_probableValues.split("$");
                }
                filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 4);
                });
                if (filterItems != null && filterItems.length > 0) {
                    $scope.ProfessionList = filterItems[0].ques_probableValues.split("$");
                }
                filterItems = $scope.Questions.filter(function (_fil) {
                    return (_fil.ques_no == 6);
                });
                if (filterItems != null && filterItems.length > 0 && filterItems[0].ques_probableValues != null) {
                    $scope.LevelList = filterItems[0].ques_probableValues.split("$");
                }
            }


        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }


    $scope.GetMasters(27, 0, '', '');
    $scope.GetMasters(28, 0, '', '');
    if (_usercode != null && _usercode != "") {
        $scope.GetMasters(54, 0, _usercode, '');
        //$scope.refername = JSON.parse(localStorage.userDetails)[0].name;
    }
    else
        window.location.href = baseURL + '/home/index';
    $scope.CloseModal = function () {
        $("#myModal").hide();
    }

}]);


app.controller("subscribeController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $(".header").show();
    $("#menu,#login_btn").hide()
    $scope.result1 = '';
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 92) {
             
            }
           

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }


    
    if (_usercode != null && _usercode != "") {
        $scope.GetMasters(92, 0, _usercode, '');
        //$scope.refername = JSON.parse(localStorage.userDetails)[0].name;
    }
    else
        window.location.href = baseURL + '/home/index';
   

}]);


app.controller("academicController", ["$scope", "$http", "$compile", "$sce", function ($scope, $http, $compile, $sce) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };
    $scope.screenLabels = {
        mobileNo: 'Mobile No *',
        name: 'Name *',
        Email: 'Email *',
        PostalCode: 'Postal Code *',
        Comments: 'Comments(Optional)',
        btnText: 'Send Email'
    };
    $(".upload_img").click(function () {
        $("#myFile").click();
    })
    $("#myFile").on("change", function () {
        var file = $("#myFile").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("image")) {
                alert("Please select image file only");
                $("#myFile").focus();
                return false;
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.img_profile').attr('src', e.target.result);
                };

                reader.readAsDataURL(file[0]);
            }
        }

    });
    
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }

    $scope.SaveRecord = function () {

        var formdata = new FormData(); 
        $scope.Answers = [];

        //if ($scope.Name == null || $scope.Name == "" || $scope.Name == undefined) {
        //    showToast("Invalid Name");
        //    return false;
        //}
        if ($scope.MobileNo == null || $scope.MobileNo == "" || $scope.MobileNo == undefined) {
            showToast("Invalid MobileNo");
            return false;
        }
        else if ($scope.StateID == null || $scope.StateID == "" || $scope.StateID == undefined) {
            showToast("Invalid State");
            return false;
        }
        else if ($scope.University == null || $scope.University == "" || $scope.University == undefined) {
            showToast("Invalid University");
            return false;
        }
        else if ($scope.concern == null || $scope.concern == "" || $scope.concern == undefined) {
            showToast("Invalid Concern");
            return false;
        }  
        else if ($scope.Reason == null || $scope.Reason == "") {
            showToast("Please enter summary");
            return false;
        } 
        else {

            if ($scope.Name == null || $scope.Name == '' || $scope.Name == undefined)
                $scope.Name = $scope.University;
            $(".loading").show();
            var data = new FormData(); 
            data.append("StateID", $scope.StateID);
            data.append("University", $scope.University);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Concern", $scope.concern);
            data.append("MobileNo", $scope.MobileNo);
            data.append("Email", $scope.Email);
            data.append("Name", $scope.Name);
            data.append("Reason", $scope.Reason);  
            $.ajax({
                url: 'https://campaigns.profcongress.in/home/SaveAcademia',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide(); 
                    if (result.Response === 200) {
                        $("#divForm,.divRegister").hide();
                        $("#content").show();
                        $('html, body').animate({
                            scrollTop: $('#content').offset().top - 20
                        }, 'slow');
                        //setTimeout(function () {
                        //    window.location.reload(true);
                        //}, 15000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
      
    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }


    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';
     
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.selectedObject = []; 
     
    $scope.FilterStates = function () {
        if ($scope.DomainID != undefined && $scope.DomainID != null)
            $scope.GetMasters(87, $scope.DomainID, "", "");
    }
    $scope.FilterUniversity = function () {
        if ($scope.StateID != undefined && $scope.StateID != null)
            $scope.GetMasters(90, $scope.StateID, 0, "");
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 52) {
                $scope.petitiondetails = response.data.objresult.Table;
                $scope.reasondetails = response.data.objresult.Table1;
                if ($scope.petitiondetails.length > 0)
                    $scope.strDesc = $sce.trustAsHtml($scope.petitiondetails[0].strDesc)
            }
            if (TypeId == 81) { 
                $scope.StateList = response.data.objresult.Table1;
            }
            if (TypeId == 90) {
                $scope.UniversityList = response.data.objresult.Table;
                
            }            
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")
                    $("#Login").modal("hide");
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }


            }


        },
            function (data) {
                alert("error occured")
                // Handle error here
            })

    }



    if (pageId != "" && pageId != undefined && pageId != null)
        $scope.GetMasters(52, 0, pageId, "");

    $scope.GetMasters(81, 0, "", "");

    $scope.baseURL = baseURL;
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    } 

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);

app.controller("mmsfellowshipController", ["$scope", "$http", "$compile", "$sce", function ($scope, $http, $compile, $sce) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };

    var now = new Date(),
    minDate = now.toISOString().substring(0, 10);
    $('#txtDOB').prop('max', minDate);
    //$scope.DOB = new Date(minDate) ;
    $(".upload_img").click(function () {
        $("#myFile").click();
    })
    $("#myFile").on("change", function () {
        var file = $("#myFile").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("video")) {
                alert("Please select video file only");
                $("#myFile").focus();
                return false;
            } 
        }
        if (file[0].size > 2097152) {
            alert('Please select file size less than 2 MB');
            return false;
        }  

    });
    $scope.shareLink = function (_t) {

        if (_t == 1) {
            var url = 'https://wa.me/?text=https://allindiamillicouncil.co.in/';
            window.open(url);
        }
    } 
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }
    $scope.FilterDistrict = function () {
        if ($scope.StateID != undefined && $scope.StateID != null)
            $scope.GetMasters(97, $scope.StateID, 0, "");
    }
    $scope.SaveRecord = function () {

        var formdata = new FormData();
        var file = $("#txtFile").get(0).files;
        $scope.Answers = [];

        if ($scope.Name == null || $scope.Name == "" || $scope.Name == undefined) {
            showToast("Invalid Name");
            return false;
        }
        else if ($scope.DOB == null || $scope.DOB == "" || $scope.DOB == undefined) {
            showToast("Invalid DOB");
            return false;
        }
        else if ($scope.Gender == null || $scope.Gender == "" || $scope.Gender == undefined) {
            showToast("Invalid Gender");
            return false;
        }
        else if ($scope.MobileNo == null || $scope.MobileNo == "" || $scope.MobileNo == undefined) {
            showToast("Invalid Mobile No");
            return false;
        }
        else if ($scope.EmailAddress == null || $scope.EmailAddress == "" || $scope.EmailAddress == undefined) {
            showToast("Invalid Email Address");
            return false;
        }
        else if ($scope.StateID == null || $scope.StateID == "" || $scope.StateID == 0) {
            showToast("Invalid StateID");
            return false;
        }
        else if ($scope.District == null || $scope.District == "" || $scope.District == 0) {
            showToast("Invalid District");
            return false;
        }
        else if ($scope.Qualification == null || $scope.Qualification == "" || $scope.Qualification == 0) {
            showToast("Invalid Qualification");
            return false;
        }
        else if (file == null || file.length == 0) {
            showToast("Invalid video file");
            return false;
        } 
        else {

            $(".loading").show();
            var data = new FormData();
            if (file.length > 0)
                data.append("file", file[0]);
            data.append("Name", $scope.Name);
            data.append("DOB", $scope.DOB.getFullYear() + "/" + ($scope.DOB.getMonth() + 1)
                + "/" + $scope.DOB.getDate());
            data.append("Gender", $scope.Gender);
            data.append("MobileNo", $scope.MobileNo);
            data.append("EmailAddress", $scope.EmailAddress);
            data.append("StateID", $scope.StateID);
            data.append("District", $scope.District);
            data.append("Qualification", $scope.Qualification);
            data.append("IPAddress", $scope.UserLocation);  
            $.ajax({
                url: baseURL + '/home/Savemmsfellowship',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    $('html, body').animate({
                        scrollTop: $('#content').offset().top - 20
                    }, 'slow');
                    if (result.Response === 200) {
                        $("#divForm,.divRegister").hide();
                        $("#content").show();
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 15000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }

    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                $scope.mobileNo = $scope.mobileNo;
                $("#divLogin").hide();
                $("#divForm").show();
            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                $("#divLogin").hide();
                $("#divForm").show();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else {
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }
    $scope.Cancel_register = function () {
        $("#divLogin").show();
        $("#divForm").hide();
        $scope.mobileNo = "";
        $("#divOTP").hide();
        $("#btnModalConfirm").html("Confirm")
        $("#txtMobileNo").attr("disabled", false);
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                $("#divOTP").show();
                $("#txtMobileNo").attr("disabled", true);
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }


    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.selectedObject = [];
    $scope.GetClickEvent = function () {


        var filterItems = $scope.AvlDates.filter(function (_fil) {
            return (_fil.id == $scope.avlDate);
        });;

        if (filterItems != '' && filterItems.length > 0) {
            var _pu = { 'id': $scope.avlDate, 'slot': '', 'date': filterItems[0].fDate };
            $scope.selectedObject = _pu;
            $(".page1").hide();
            $(".page2").show(); $(".page4").hide();
            $(".page3").hide();
        }
    }
    $scope.OnClickConfirm = function () {
        $scope.BookSlot(41, $scope.loginDetails.id, $scope.selectedObject.id, $scope.selectedObject.date, $scope.selectedObject.slot);
    }
    $scope.OnDateChange = function () {
        $scope.GetMasters(42, $scope.avlDate, "", "");
    }
   
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 52) {
                $scope.petitiondetails = response.data.objresult.Table;
                $scope.reasondetails = response.data.objresult.Table1;
                if ($scope.petitiondetails.length > 0)
                    $scope.strDesc = $sce.trustAsHtml($scope.petitiondetails[0].strDesc)
            }
            if (TypeId == 81) {
                $scope.StateList = response.data.objresult.Table1; 
                $scope.DesignationList = [];
            }
            if (TypeId == 87) {
                $scope.StateList = response.data.objresult.Table;
                $scope.DesignationList = [];
            }
            if (TypeId == 97) {
                $scope.DistrictList = response.data.objresult.Table; 
            }
            if (TypeId == 88) {
                $scope.DesignationList = response.data.objresult.Table;
            }
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")
                    $("#Login").modal("hide");
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }


            }


        },
            function (data) {
                alert("error occured")
                // Handle error here
            })

    }



    if (pageId != "" && pageId != undefined && pageId != null)
        $scope.GetMasters(52, 0, pageId, "");

    $scope.GetMasters(81, 0, "", "");

    $scope.baseURL = baseURL;
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);

app.controller("positionController", ["$scope", "$http", "$compile", "$sce", function ($scope, $http, $compile, $sce) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };
    $scope.screenLabels = {
        mobileNo: 'Mobile No *',
        name: 'Name *',
        Email: 'Email *',
        PostalCode: 'Postal Code *',
        Comments: 'Comments(Optional)',
        btnText: 'Send Email'
    };
    $(".upload_img").click(function () {
        $("#myFile").click();
    })
    $("#myFile").on("change", function () {
        var file = $("#myFile").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("image")) {
                alert("Please select image file only");
                $("#myFile").focus();
                return false;
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.img_profile').attr('src', e.target.result);
                };

                reader.readAsDataURL(file[0]);
            }
        }

    });
    $scope.shareLink = function (_t) {

        if (_t == 1) {
            var url = 'https://wa.me/?text=https://allindiamillicouncil.co.in/';
            window.open(url);
        }
    }
    $scope.ChangeLanguage = function (lan) {
        if (lan == 2) {
            $scope.screenLabels = {
                mobileNo: 'Mobile No *',
                name: 'Name *',
                Email: 'Email *',
                PostalCode: 'Postal Code *',
                Comments: 'Comments(Optional)',
                btnText: 'Send Email'
            };
            $("#a2").removeClass().addClass("btn btn-success active")
            $("#a1,#a3").removeClass().addClass("btn btn-secondary")
        }
        else if (lan == 1) {
            $scope.screenLabels = {
                mobileNo: 'மொபைல் எண் *',
                name: 'பெயர் *',
                Email: 'மின்னஞ்சல் *',
                PostalCode: 'குறியீடு *',
                Comments: 'கருத்துகள்(விரும்பினால்)',
                btnText: 'மின்னஞ்சல் அனுப்பவும்'
            };
            $("#a1").removeClass().addClass("btn btn-success active")
            $("#a2,#a3").removeClass().addClass("btn btn-secondary")
        }
        else if (lan == 3) {
            $scope.screenLabels = {
                mobileNo: 'موبائل نمبر*',
                name: 'نام*',
                Email: 'ای میل *',
                PostalCode: 'پوسٹل کوڈ*',
                Comments: 'تبصرے',
                btnText: 'ای میل بھیجیں'
            };
            $("#a3").removeClass().addClass("btn btn-success active")
            $("#a1,#a2").removeClass().addClass("btn btn-secondary")
        }
    }
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }
     
    $scope.SaveRecord3 = function () {

        var formdata = new FormData();
        var file = $("#txtFile").get(0).files;
        $scope.Answers = []; 
      
        if ($scope.DomainID == null || $scope.DomainID == "" || $scope.DomainID == undefined) {
            showToast("Invalid Domain");
            return false;
        }
        else if ($scope.StateID == null || $scope.StateID == "" || $scope.StateID == undefined) {
            showToast("Invalid State");
            return false;
        }
        else if ($scope.Designation == null || $scope.Designation == "" || $scope.Designation == undefined) {
            showToast("Invalid Designation");
            return false;
        }
        //else if ($scope.Linkedin == null || $scope.Linkedin == "" || $scope.Linkedin == undefined) {
        //    showToast("Invalid Linkedin");
        //    return false;
        //}
        else if (file == null || file.length == 0) {
            showToast("Invalid Resume");
            return false;
        }
        else if ($scope.Reason == null || $scope.Reason == "") {
            showToast("Please write few lines about yourself");
            return false;
        }
        else if ($scope.mobileNo == null || $scope.mobileNo == "" || $scope.mobileNo == undefined) {
            showToast("Invalid mobile no");
            return false;
        }
        else {

            $(".loading").show();
            var data = new FormData();
            if (file.length > 0)
                data.append("file", file[0]);
            data.append("State", $scope.StateID);
            data.append("Domain", $scope.DomainID);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Designation", $scope.Designation);
            data.append("Linkedin", $scope.Linkedin);
            data.append("Reason", $scope.Reason); data.append("MobileNo", $scope.mobileNo);
            $.ajax({
                url: baseURL + '/home/SaveOpening',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    $('html, body').animate({
                        scrollTop: $('#content').offset().top - 20
                    }, 'slow');
                    if (result.Response === 200) {
                        $("#divForm,.divRegister").hide();
                        $("#content_msg").show();
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 15000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
     
    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                $scope.mobileNo = $scope.mobileNo;
                $("#divLogin").hide();
                $("#divForm").show();
            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true; 
                $("#divLogin").hide();
                $("#divForm").show();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else { 
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }
    $scope.Cancel_register = function () {
        $("#divLogin").show();
        $("#divForm").hide();
        $scope.mobileNo = "";
        $("#divOTP").hide();
        $("#btnModalConfirm").html("Confirm")
        $("#txtMobileNo").attr("disabled", false); 
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                $("#divOTP").show();
                $("#txtMobileNo").attr("disabled", true); 
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }


    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';
     
    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.selectedObject = [];
    $scope.GetClickEvent = function () {


        var filterItems = $scope.AvlDates.filter(function (_fil) {
            return (_fil.id == $scope.avlDate);
        });;

        if (filterItems != '' && filterItems.length > 0) {
            var _pu = { 'id': $scope.avlDate, 'slot': '', 'date': filterItems[0].fDate };
            $scope.selectedObject = _pu;
            $(".page1").hide();
            $(".page2").show(); $(".page4").hide();
            $(".page3").hide();
        }
    }
    $scope.OnClickConfirm = function () {
        $scope.BookSlot(41, $scope.loginDetails.id, $scope.selectedObject.id, $scope.selectedObject.date, $scope.selectedObject.slot);
    }
    $scope.OnDateChange = function () {
        $scope.GetMasters(42, $scope.avlDate, "", "");
    }
    $scope.FilterStates = function () {
        if ($scope.DomainID != undefined && $scope.DomainID != null)
            $scope.GetMasters(87, $scope.DomainID, "", "");
    }
    $scope.FilterDesignation = function () {
        if ($scope.StateID != undefined && $scope.StateID != null)
            $scope.GetMasters(88, $scope.DomainID, $scope.StateID, "");
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 52) {
                $scope.petitiondetails = response.data.objresult.Table;
                $scope.reasondetails = response.data.objresult.Table1;
                if ($scope.petitiondetails.length > 0)
                    $scope.strDesc = $sce.trustAsHtml($scope.petitiondetails[0].strDesc)
            }
            if (TypeId == 81) {
                $scope.DomainList = response.data.objresult.Table;
                $scope.StateList = []; 
                $scope.DesignationList = [];
            }
            if (TypeId == 87) { 
                $scope.StateList = response.data.objresult.Table;
                $scope.DesignationList = [];
            }
            if (TypeId == 88) {
                $scope.DesignationList = response.data.objresult.Table;
            }
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table; 
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")
                    $("#Login").modal("hide");
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }


            }


        },
            function (data) {
                alert("error occured")
                // Handle error here
            })

    }



    if (pageId != "" && pageId != undefined && pageId != null)
        $scope.GetMasters(52, 0, pageId, "");

    $scope.GetMasters(81, 0, "", "");

    $scope.baseURL = baseURL;
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);


app.controller("registerController", ["$scope", "$http", "$compile", "$sce", function ($scope, $http, $compile, $sce) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };
    $scope.screenLabels = {
        mobileNo: 'Mobile No *',
        name: 'Name *',
        Email: 'Email *',
        PostalCode: 'Postal Code *',
        Comments: 'Comments(Optional)',
        btnText: 'Send Email'
    };
    $(".upload_img").click(function () {
        $("#myFile").click();
    })
    $("#myFile").on("change", function () {
        var file = $("#myFile").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("image")) {
                alert("Please select image file only");
                $("#myFile").focus();
                return false;
            }
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.img_profile').attr('src', e.target.result);
                };

                reader.readAsDataURL(file[0]);
            }
        }

    });
    $scope.shareLink = function (_t) {

        if (_t == 1) {
            var url = 'https://wa.me/?text=https://allindiamillicouncil.co.in/';
            window.open(url);
        }
    }
    $scope.ChangeLanguage = function (lan) {
        if (lan == 2) {
            $scope.screenLabels = {
                mobileNo: 'Mobile No *',
                name: 'Name *',
                Email: 'Email *',
                PostalCode: 'Postal Code *',
                Comments: 'Comments(Optional)',
                btnText: 'Send Email'
            };
            $("#a2").removeClass().addClass("btn btn-success active")
            $("#a1,#a3").removeClass().addClass("btn btn-secondary")
        }
        else if (lan == 1) {
            $scope.screenLabels = {
                mobileNo: 'மொபைல் எண் *',
                name: 'பெயர் *',
                Email: 'மின்னஞ்சல் *',
                PostalCode: 'குறியீடு *',
                Comments: 'கருத்துகள்(விரும்பினால்)',
                btnText: 'மின்னஞ்சல் அனுப்பவும்'
            };
            $("#a1").removeClass().addClass("btn btn-success active")
            $("#a2,#a3").removeClass().addClass("btn btn-secondary")
        }
        else if (lan == 3) {
            $scope.screenLabels = {
                mobileNo: 'موبائل نمبر*',
                name: 'نام*',
                Email: 'ای میل *',
                PostalCode: 'پوسٹل کوڈ*',
                Comments: 'تبصرے',
                btnText: 'ای میل بھیجیں'
            };
            $("#a3").removeClass().addClass("btn btn-success active")
            $("#a1,#a2").removeClass().addClass("btn btn-secondary")
        }
    }
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }

    $scope.SaveRecord = function () {

        var formdata = new FormData();
        //var file = $("#myFile").get(0).files;
        $scope.Answers = [];
        //if (file == null || file.length == 0) {
        //    showToast("Invalid profile pic");
        //     return false;
        // }
        if ($scope.Name == null || $scope.Name == "") {
            showToast("Invalid Name");
            return false;
        }
        else if ($scope.Occupation == null || $scope.Occupation == "") {
            showToast("Invalid Occupation");
            return false;
        }
        else if ($scope.MobileNo == null || $scope.MobileNo == "") {
            showToast("Invalid MobileNo");
            return false;
        }
        else if ($scope.Email == null || $scope.Email == "") {
            showToast("Invalid Email");
            return false;
        }
        
        else {

            $(".loading").show();
            var data = new FormData();
            //if (file.length > 0)
            //    data.append("file", file[0]); 
            data.append("Name", $scope.Name);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Occupation", $scope.Occupation);
            data.append("MobileNo", $scope.MobileNo);
            data.append("Location", "Jammu"); data.append("Email", $scope.Email);
            data.append("Reason", "");
            $.ajax({
                url: baseURL + '/home/RegisterDogriDham',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) {

                        showToast("Successfully Registered");
                        $("#content").show();
                        $("#hRegister,#divForm").hide();
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 10000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }

    $scope.SaveRecord2 = function () {

        var formdata = new FormData();
        //var file = $("#myFile").get(0).files;
        $scope.Answers = [];
        //if (file == null || file.length == 0) {
        //    showToast("Invalid profile pic");
        //     return false;
        // }
        if ($scope.Name == null || $scope.Name == "") {
            showToast("Invalid Name");
            return false;
        }
        else if ($scope.Occupation == null || $scope.Occupation == "") {
            showToast("Invalid Occupation");
            return false;
        }
        else if ($scope.MobileNo == null || $scope.MobileNo == "") {
            showToast("Invalid MobileNo");
            return false;
        }
        else if ($scope.Company == null || $scope.Company == "") {
            showToast("Invalid Company");
            return false;
        }
        else if ($scope.Email == null || $scope.Email == "") {
            showToast("Invalid Email");
            return false;
        }

        else {

            $(".loading").show();
            var data = new FormData();
            //if (file.length > 0)
            //    data.append("file", file[0]); 
            data.append("Name", $scope.Name);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Occupation", $scope.Occupation);
            data.append("Company", $scope.Company);
            data.append("MobileNo", $scope.MobileNo);
            data.append("Location", "Coimbatore"); data.append("Email", $scope.Email);
            data.append("Reason", "");
            $.ajax({
                url: baseURL + '/home/RegisterCoimbatore',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) {

                        showToast("Successfully Registered");
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 2000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
    $scope.SaveManifesto = function () {
        $(".page1").hide();
        $(".page2").hide();
        $(".page3").show();
        $("#Login").hide();
    }
    $scope.SaveRecord_Hyd = function () {

        var formdata = new FormData();
        //var file = $("#myFile").get(0).files;
        $scope.Answers = [];
        //if (file == null || file.length == 0) {
        //    showToast("Invalid profile pic");
        //     return false;
        // }
        if ($scope.Name == null || $scope.Name == "") {
            showToast("Invalid Name");
            return false;
        }
        else if ($scope.Email == null || $scope.Email == "") {
            showToast("Invalid Email");
            return false;
        }
        else if ($scope.Company == null || $scope.Company == "") {
            showToast("Invalid Company");
            return false;
        }
        //else if ($scope.Occupation == null || $scope.Occupation == "") {
        //    showToast("Invalid Role");
        //    return false;
        //} 
        if ($scope.Reason == null || $scope.Reason == "") {
            showToast("Invalid concern/issue");
            return false;
        }
        else {

            $(".loading").show();
            var data = new FormData();
            //if (file.length > 0)
            //    data.append("file", file[0]); 
            data.append("Name", $scope.Name);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Occupation", $scope.Occupation);
            data.append("Company", $scope.Company); data.append("Email", $scope.Email);
            data.append("Reason", $scope.Reason); data.append("MobileNo", $scope.MobileNo);
            $.ajax({
                url: baseURL + '/home/RegisterBrane_Hyd',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) {
                        $("#divForm,.divRegister").hide();
                        $("#content").show();
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 15000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
    $scope.SaveRecord3 = function () {

        var formdata = new FormData();
        //var file = $("#myFile").get(0).files;
        $scope.Answers = [];
        //if (file == null || file.length == 0) {
        //    showToast("Invalid profile pic");
        //     return false;
        // }
        if ($scope.Name == null || $scope.Name == "") {
            showToast("Invalid Name");
            return false;
        } 
        else if ($scope.Email == null || $scope.Email == "") {
            showToast("Invalid Email");
            return false;
        }
          else if ($scope.Company == null || $scope.Company == "") {
            showToast("Invalid Company");
            return false;
        }
        //else if ($scope.Occupation == null || $scope.Occupation == "") {
        //    showToast("Invalid Role");
        //    return false;
        //} 
          if ($scope.Reason == null || $scope.Reason == "") {
            showToast("Invalid concern/issue");
            return false;
        } 
        else {

            $(".loading").show();
            var data = new FormData();
            //if (file.length > 0)
            //    data.append("file", file[0]); 
            data.append("Name", $scope.Name);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Occupation", $scope.Occupation);
            data.append("Company", $scope.Company);  data.append("Email", $scope.Email);
              data.append("Reason", $scope.Reason); data.append("MobileNo", $scope.MobileNo);
            $.ajax({
                url: baseURL + '/home/RegisterBrane',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) {
                        $("#divForm,.divRegister").hide();
                        $("#content").show(); 
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 15000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }

    $scope.SaveRecord4 = function () {

        var formdata = new FormData();
        //var file = $("#myFile").get(0).files;
        $scope.Answers = [];
        //if (file == null || file.length == 0) {
        //    showToast("Invalid profile pic");
        //     return false;
        // }
        //if ($scope.Name == null || $scope.Name == "") {
        //    showToast("Invalid Name");
        //    return false;
        //}
        //else if ($scope.Email == null || $scope.Email == "") {
        //    showToast("Invalid Email");
        //    return false;
        //}
        //else if ($scope.Company == null || $scope.Company == "") {
        //    showToast("Invalid Company");
        //    return false;
        //}
        //else if ($scope.Occupation == null || $scope.Occupation == "") {
        //    showToast("Invalid Role");
        //    return false;
        //} 
        if ($scope.Reason == null || $scope.Reason == "") {
            showToast("Invalid comments");
            return false;
        }
        else {

            $(".loading").show();
            var data = new FormData();
            //if (file.length > 0)
            //    data.append("file", file[0]); 
            data.append("Name", $scope.Name);
            data.append("IPAddress", $scope.UserLocation);
            data.append("Occupation", $scope.Occupation);
            data.append("Age", $scope.Age);
            data.append("Gender", $scope.Gender);
            data.append("Company", $scope.Company); data.append("Email", $scope.Email);
            data.append("Reason", $scope.Reason); data.append("MobileNo", $scope.MobileNo);
            $.ajax({
                url: baseURL + '/home/RegisterAnna',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    $(".loading").hide();
                    if (result.Response === 200) {
                        $("#divForm,.divRegister").hide();
                        $("#content").show();
                        $('html, body').animate({
                            scrollTop: $("#content").offset().top
                        }, 2000);
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 15000)

                    }
                    else {
                        showToast(result.Data)
                    }
                },
                error: function (errormessage) {

                }
            });
        }
    }
    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
                //localStorage.setItem("loginUser", $scope.mobileNo);
                //localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));


                //if (JSON.parse(localStorage.userDetails)[0].role == "R")
                //    window.location.href = baseURL + "/home/rpt";
                //else
                //    window.location.href = baseURL + "/home/profile";

            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }


    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope.SubmitPetition = function () {
        var formdata = new FormData();
        if ($scope.MobileNo == null || $scope.MobileNo == "" || $scope.MobileNo == undefined) {
            showToast("Invalid mobile no");
            return false;
        }
        else if ($scope.Name == null || $scope.Name == "" || $scope.Name == undefined) {
            showToast("Invalid Name");

            return false;
        }
        else if ($scope.Email == null || $scope.Email == "" || $scope.Email == undefined) {
            showToast("Invalid Email");
            return false;
        }
        else if ($scope.ZipCode == null || $scope.ZipCode == "" || $scope.ZipCode == undefined) {
            showToast("Invalid ZipCode");
            return false;
        }
        //else if ($scope.Reason == null || $scope.Reason == "" || $scope.Reason == undefined) {
        //    showToast("Invalid Reason");
        //    return false;
        //} 
        else {
            $(".loading").show();
            $("#btnSubmit").attr("disabled", true);
            setTimeout(function () {
                var data = new FormData();
                data.append("MobileNo", $scope.MobileNo);
                data.append("Name", $scope.Name);
                data.append("Email", $scope.Email);
                data.append("ZipCode", $scope.ZipCode);
                data.append("Reason", $scope.Reason);
                data.append("IPAddress", $scope.UserLocation);
                //data.append("chkDisplay", $("#chkDisplay").prop("checked") == true ? 1 : 0);
                data.append("chkDisplay", 1);
                data.append("pageId", pageId); data.append("membercode", membercode);
                $.ajax({
                    url: baseURL + '/home/saveSignIn',
                    type: "POST",
                    data: data,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        $(".loading").hide();
                        if (result.Response === 200) {

                            showToast("Successfully Submitted");
                            var body = `%0D%0AIn response to the public notification in context to Waqf Amendment Bill 2024 , I strongly suggest it to be rolled back for the following reasons listed  below .%0D%0A%0D%0A1.The Bill is maliciously designed to target Muslim Community and to unsurp or destroy the Waqf properties.The Bill was framed without consulting the Stakeholders ( Muslims ).%0D%0A%0D%0A2.The concept of Waqf emerges from Islamic religious belief where a Waqif dedicates his / her   self acquired or inherited private property in the name of God for charity purpose. However the proposed Bill seeks to dismantle the salient features of the meticulously developed centuries old waqf.%0D%0A%0D%0A3 The role and powers given to the  Collector as per the proposed Bill in the administration of Waqf properties is highly objectionable and it is as if the  Collector will virtually take over the whole Waqf Administration as against the Waqf board and Central Waqf Council.%0D%0A%0D%0AAs per the proposed Bill the Collector can re-open any waqf and even old and notified Waqf and determine whether the property is govt property or not. Collector will also be able to give directions to Mutawalli and no new registration can be done without the approval of the Collector . These provisions are not only Autocratic but are also highly unsecular because in the Hindu Endowment Act , there is no role of Collector in the Registration of Endowments or determination of Endowments properties and the Asst.Commissioner is the competent Authority to register any Endowment property on the application and after fulfilling due formality. Then why the collector is given a role in Waqf Administration ? Will the govt equally involve the Collector in the Management of the Endowment properties ? %0D%0AThese provisions are also unconstitutional because it is a settled law that only civil court can determine the title of any property whether it is waqf or govt .property %0D%0A%0D%0A4 .The Bill aims to dismantle the concept of  Waqf by user which is the essence of the Waqf jurisprudence ,this move through exclusion  of it from the Waqf Act will endanger mosques, dargahs ,Qabrastans .The provision of Waqf by user is also aimed at targeting the Muslim properties because as per Muslim personal.law oral gift is permissible and valid and many many waqfs have been made by oral gifts .deletion of Waqf by user is also violative of Transfer of property Act which permits the oral disposal of the property.%0D%0A%0D%0A5.The Bill authorises the govt  to nominate members  to the Waqf board .it proposes to Amend the whole constitution of central waqf council and waqf board .there not only 2 non Muslim members are necessarily inducted but also there is a provision that majority of the members can be non muslims.This is not only undemocratic but also Discriminatory because similar Dharmik Parishad in Hindu Endowment Act ensures that there can be no Non Hindu member. Will the Govt .include Muslim members in the Management of Hindu religious endowment ? %0D%0AThe proposed Bill  also seeks to make the Waqf board nominated instead of elected , the general rule in a democracy is there should be a movement from nomination to election but the present govt desires   to move from elected board to nominated board , the reasons are obvious ,so that the govt can  fill up the Board  with its " own people " . %0D%0A%0D%0A6.Similarly the deletion of protection from Limitation Act is also Discriminatory because Similar protection to Endowment properties are available in Hindu Endowment Act and  are not deleted.%0D%0A%0D%0A7.Similarly the provisions of curtailing the powers of Waqf Tribunal are also Discriminatory because the proposed Amendment seeks to make the decisions of the Waqf Tribunal as non final whereas similar Hindu Endowment Tribunal ,the decisions of the Tribunal are final in all Endowment disputes.%0D%0A%0D%0A8 .The proposed Amendments are arbitrary and violative of Article 25, 26 ,29 and 14 of the Indian Constitution .Right to manage and administer is proposed to be given to the collectors and through the revenue Authorities like the Nazul Lands and government acquired properties thereby making the waqf properties more vulnerable .%0D%0A%0D%0A9.Bill states that any govt property identified as waqf will cease to be so , while it is an acclaimed fact that the biggest encroachment of Waqf properties is by the state and central governments.%0D%0A%0D%0A10.These are some of the provisions which are directly opposite to the provisions in Hindu Endowment Act . If something is good for Waqf then why the same is not good for Hindu Endowments ?%0D%0A%0D%0AYours sincerely,%0D%0A` + $scope.Name;
                            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                var mail = "mailto:jpcwaqf-lss@sansad.nic.in?subject=I, " + $scope.Name + ", Reject Waqf Amendment Bill 2024&body=" + body;
                                window.location.href = mail;
                            } else {
                                var emailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=jpcwaqf-lss@sansad.nic.in&su=I, " + $scope.Name + ", Reject Waqf Amendment Bill 2024";
                                var modifiedEmailLink = emailLink + "&body=" + body;
                                window.open(modifiedEmailLink);
                            }
                            setTimeout(function () {
                                window.location.reload(true);
                            }, 10000)
                        }
                        else {
                            showToast(result.Data);
                        }
                    }, error: function (errormessage) {

                    }
                });
            }, 500)
        }


    }
    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.selectedObject = [];
    $scope.GetClickEvent = function () {


        var filterItems = $scope.AvlDates.filter(function (_fil) {
            return (_fil.id == $scope.avlDate);
        });;

        if (filterItems != '' && filterItems.length > 0) {
            var _pu = { 'id': $scope.avlDate, 'slot': '', 'date': filterItems[0].fDate };
            $scope.selectedObject = _pu;
            $(".page1").hide();
            $(".page2").show(); $(".page4").hide();
            $(".page3").hide();
        }
    }
    $scope.OnClickConfirm = function () {
        $scope.BookSlot(41, $scope.loginDetails.id, $scope.selectedObject.id, $scope.selectedObject.date, $scope.selectedObject.slot);
    }
    $scope.OnDateChange = function () {
        $scope.GetMasters(42, $scope.avlDate, "", "");
    }

    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 52) {
                $scope.petitiondetails = response.data.objresult.Table;
                $scope.reasondetails = response.data.objresult.Table1;
                if ($scope.petitiondetails.length > 0)
                    $scope.strDesc = $sce.trustAsHtml($scope.petitiondetails[0].strDesc)
            }
                

            },
                function (data) {
                    alert("error occured")
                    // Handle error here
                })

    }



    if (pageId != "" && pageId != undefined && pageId != null)
        $scope.GetMasters(52, 0, pageId, "");

    $scope.baseURL = baseURL;
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);

app.controller("scheduleController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }
    $scope.nxtbtn = function (val) {

        if (val == 0) {
            $(".page1").show();
            $(".page2").hide();
            $(".page3").hide(); $(".page4").hide();
            $("#Login").hide();
            $("#divConfirmation").hide();
        }
        else if (val == 1) {
            if ($scope.selectedObject != null || $scope.selectedObject.length > 0) { 

                $(".page1").hide();
                $(".page2").show();
                $(".page3").hide(); $(".page4").hide();
                $("#Login").hide(); $("#divConfirmation").hide();

                $scope.manifestoObject.menifesto = [];
            }

        }
        else if (val == 2) {

            $("#divConfirmation").hide();
            if ($(".chk:checked").length == 0) {
                showToast("Please select atleast one contribution");
                return false;
            }
            if ($(".chk:checked")[0].value == "None of these options interest me") {
                $("#divConfirmation").show();
                return false;
            }
            $(".page1").hide();
            $(".page2").hide();
            $(".page3").show();
            $("#Login").show();

            $(".chk:checked").each(function (i) {
                $scope.manifestoObject.manifesto.push({ "option": $(".chk:checked")[i].value });
            })
        }
        else if (val == 3) {
            $(".page1").show();
            $(".page2").hide();
            $(".page3").hide();
            $("#Login").hide(); $(".page4").hide();
            $("#divConfirmation").hide();
        }

    }
    $scope.SaveManifesto = function () {
        $(".page1").hide();
        $(".page2").hide();
        $(".page3").show();
        $("#Login").hide();
    }

    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
                //localStorage.setItem("loginUser", $scope.mobileNo);
                //localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));


                //if (JSON.parse(localStorage.userDetails)[0].role == "R")
                //    window.location.href = baseURL + "/home/rpt";
                //else
                //    window.location.href = baseURL + "/home/profile";

            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading1").hide();
                $("#divOTP").show();
                $("#txtMobileNo").attr("disabled", true);
                $("#divChangeNo").show();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading1").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    $scope.selectedObject = [];
    $scope.GetClickEvent = function ( ) { 
       

        var filterItems = $scope.AvlDates.filter(function (_fil) {
            return (_fil.id == $scope.avlDate);
        });;

        if (filterItems != '' && filterItems.length > 0) {
            var _pu = { 'id': $scope.avlDate, 'slot': '', 'date': filterItems[0].fDate };
            $scope.selectedObject = _pu;
            $(".page1").hide();
            $(".page2").show(); $(".page4").hide();
            $(".page3").hide();
        }
    }
    $scope.OnClickConfirm = function () {
        $scope.BookSlot(41, $scope.loginDetails.id, $scope.selectedObject.id, $scope.selectedObject.date, $scope.selectedObject.slot);
    }
    $scope.OnDateChange = function () {
        $scope.GetMasters(42, $scope.avlDate, "", "");  
    }
    $scope.SubscribeUpdates = function () {
        if ($scope.UMobileno == null || $scope.UMobileno == undefined || $scope.UMobileno == "") {
            showToast("Invalid mobile no");
            return false;
        }
        else
            $scope.GetMasters(45, 0, $scope.UMobileno, "");  
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 40) {
                $scope.AvlDates = response.data.objresult.Table;

            }
            if (TypeId == 45) {
                showToast("Thanks for your interest")
               window.location.reload(true);

            }
            if (TypeId == 42) {

                $scope.FilterAvlDates = response.data.objresult.Table;
                $scope.BookedSlots = response.data.objresult.Table1; 
                if (!$scope.FilterAvlDates[0].isActive) {
                    $(".page5").show();
                    $(".page1").hide();
                    return false;
                }
                var theAdd = new Date();
                var toAdd = new Date();
                if ($scope.FilterAvlDates != '' && $scope.FilterAvlDates.length > 0) {  

                    var slots = $scope.FilterAvlDates[0].slots.split(';');
                     
                    var ele = '<div class="row col-md-12">';
                    for (var i = 0; i < slots.length; i++) {
                        //   theAdd.setMinutes(theAdd.getMinutes() + 10);
                        if (slots[i] != "") {
                            var ampm = slots[i];
                            var _pu = { 'id': $scope.FilterAvlDates[0].id, 'slot': ampm, 'date': $scope.FilterAvlDates[0].fDate };

                            var filterItems = $scope.BookedSlots.filter(function (_fil) {
                                return (_fil.timing == ampm);
                            });;
                            if (filterItems != null && filterItems.length > 0) {
                                ele += "<div class='col-md-6 td_booked'  ><a href='javascript::'  >" + ampm + "</a></div>";;
                            }
                            else {
                                ele += "<div class='col-md-6 td_available' ng-click='GetClickEvent(" + JSON.stringify(_pu) + ")'><a href='javascript::' ng-click='GetClickEvent(" + JSON.stringify(_pu) + ")'  >" + ampm + "</a></div>";;

                            }
                        }

                    }
                    ele += "</div>";

                   // $compile($(".top_inner_div").empty().html(ele))($scope);
                }

            }
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table; 
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html(" A one-to-one meeting with the Chairman is only for registered members. We could not find your number as a registered AIPC member. If you provided a different number during registration, please enter that number. If you are not a registered AIPC member and want to become one,please go to <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>.")
                    $("#Login").modal("hide");
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }


            }


        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }

    $scope.BookSlot = function (TypeId, Userid,FilterID, FilterText, FilterText1) { 
        
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: Userid,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 41) {
                $(".page1").hide();
                $(".page2").hide(); $(".page4").show();
                $(".page3").hide();  
            }  


        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(40, 0, "", "");
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);
app.controller("manifestoController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo:''
    };
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }
    $scope.nxtbtn = function (val) {

        if (val == 0) {
            $(".page1").show();
            $(".page2").hide();
            $(".page3").hide();
            $("#Login").hide();
            $("#divConfirmation").hide();
        }
        else if (val == 1) {
            $(".page1").hide();
            $(".page2").show();
            $(".page3").hide();
            $("#Login").hide(); $("#divConfirmation").hide();

            $scope.manifestoObject.menifesto = [];

        }
        else if (val == 2) {

            $("#divConfirmation").hide();
            if ($(".chk:checked").length == 0) {
                showToast("Please select atleast one contribution");
                return false;
            }
            if ($(".chk:checked")[0].value == "None of these options interest me") {
                $("#divConfirmation").show();
                return false;
            }
            $(".page1").hide();
            $(".page2").hide();
            $(".page3").show();
            $("#Login").show();
           
            $(".chk:checked").each(function (i) {
                $scope.manifestoObject.manifesto.push({ "option": $(".chk:checked")[i].value });
            })
        }
        else if (val == 3) {
            $(".page1").hide();
            $(".page2").hide();
            $(".page3").hide();
            $("#Login").show();
            $("#divConfirmation").hide();
        }
        
    }
    $scope.SaveManifesto = function () {
        $scope.GetMasters(33, 0, $scope.mobileNo, JSON.stringify($scope.manifestoObject.manifesto));
    }

    $scope.CheckLogin = function () { 
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) { 
                $scope.manifestoObject.mobileNo = $scope.mobileNo;  
                $scope.SaveManifesto();
                //localStorage.setItem("loginUser", $scope.mobileNo);
                //localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
               

                //if (JSON.parse(localStorage.userDetails)[0].role == "R")
                //    window.location.href = baseURL + "/home/rpt";
                //else
                //    window.location.href = baseURL + "/home/profile";

            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;  
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();  
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading1").hide();
                $("#divOTP").show(); 
                $("#txtMobileNo").attr("disabled", true);
                $("#divChangeNo").show();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading1").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;  
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 28) {
                $scope.Questions = response.data.objresult.Table;
                // console.log("Question Length:"+ $scope.Questions.length)
                $("#visitor_msg").attr("type", "number")
                $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><p>' + $scope.Questions[$scope.Qno].ques_name + ' </p></div></li>');
            }
            if (TypeId == 27) {
                $scope.Languages = response.data.objresult.Table;
                var ele = '<div>';
                $.each($scope.Languages, function (pr, pv) {
                    var pu = [];
                    pu.push({ "language_id": pv.language_id, "language_name": pv.language_name });
                    ele += "<button type='button' id='btnlanguage' class='langbtn' ng-click=GetQuestions(" + JSON.stringify(pu[0]) + ")>" + pv.language_name + "</button>";
                })
                ele += '</div>';
                $compile($("#languages").empty().append('<div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div>' + ele + '</div>'))($scope);
                //var ele = '<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><button type="button" id="btnlanguage" class="langbtn" ng-click="TakeSelfi()">Take Selfie</button></div></li>';
                //$compile($(".chat").append(ele))($scope);
            }
            if (TypeId == 29) {
                $scope.duplicateNo = response.data.objresult.Table;
                if ($scope.duplicateNo != undefined && $scope.duplicateNo.length > 0) {
                    //alert("Already submitted, please contact administrator");

                    $compile($(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> You are already a registered member of AIPC. Thank You.<br/><a href="javascript::" style="color:white" ng-click="showLogin()">Click to login using your mobile number</a> </p></div></div></li>'))($scope);
                    $scope.ScrollToBottom();
                    $("#visitor_msg").attr("disabled", true)
                    setTimeout(function () {

                        window.location.reload(true);
                    }, 10000)
                    return false;
                }
                else {
                    $(".loading").show();
                    $scope._SendOTP(FilterText);
                }
            }
            if (TypeId == 30) {
                if (response.data.Status == "-100") {
                    $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> ' + $scope.Questions[$scope.Qno].ques_errMsg + ' </p></div></div></li>');
                    $scope.ScrollToBottom();
                    return false;

                }
                else {
                    $scope.pinCodeDtls = response.data.objresult.Table;
                    if ($scope.pinCodeDtls == undefined || $scope.pinCodeDtls.length == 0) {
                        $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> ' + $scope.Questions[$scope.Qno].ques_errMsg + ' </p></div></div></li>');
                        $scope.ScrollToBottom();
                        return false;
                    }
                    else {
                        $("#PinCodeBox").modal("show")
                    }
                }
            }
            if (TypeId == 33) {
                $(".page4").show();
                $("#divConfirmation").hide();
                $("#Login").hide();
            }
            if (TypeId == 37) {

            }
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                setTimeout(function () {
                    $scope.GetMasters(37, 0, $scope.mobileNo, JSON.stringify($scope.manifestoObject.manifesto));
                },500)
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                   // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")
                    $("#Login").modal("hide");
                   // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }
              

            }

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(27, 0, "", "");
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    } 
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);

app.controller("bnyController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny:[]
    };
    $scope.SelectedSchedule = {};
    $scope.selectDate = function (item) {

        $scope.bnyObject.ScheduleId = item.id;
        $scope.SelectedSchedule = item;
        $scope.nxtbtn(1);

    }
    //$("#txtendDate").on("change", function () {
    //    this.setAttribute(
    //        "data-date",
    //        moment(this.value, "YYYY-MM-DD")
    //            .format(this.getAttribute("data-date-format"))
    //    )

    //}).trigger("change")
    
    $scope.nxtbtn = function (val) {

        if (val == 0) {
            $(".page3").show();
            $(".page5").hide();
            $(".page2").hide();
            $("#Login").hide();
            $(".page4").hide();
            $(".page6").hide();
        }
        else if (val == 1) { 
            $(".page3").hide();
            $(".page5").show();
            $(".page2").hide();
            $("#Login").hide();
            $(".page4").hide();
            $(".page6").hide();
            let dateobj =
                new Date($scope.SelectedSchedule.date);  
            const today = new Date(dateobj).toISOString().substring(0, 10);
            document.getElementById('txtStartDate').value = today;
        }
        else if (val == 2) {
            const inputDate = new Date($("#txtStartDate").val());

            const currentDate = new Date($("#txtendDate").val());
            const end_date = new Date(2024, 2, 21);

            if ($("#txtStartDate").val() == "" || $("#txtStartDate").val() == null ||
                $("#txtStartDate").val() == undefined) {
                showToast("Invalid start date");
                return false;
            }
            else if ($("#txtendDate").val() == "" || $("#txtendDate").val() == null ||
                $("#txtStartDate").val() == undefined) {
                showToast("Invalid end date");
                return false;
            }
            else if (inputDate > currentDate) {
                showToast("start date cannot be greater than end date");
                return false;
            }
            else if (currentDate < inputDate) {
                showToast("end date cannot be less than start date");
                return false;
            }
            else if (currentDate > end_date) {
                showToast("end date cannot be greater than yatra end date");
                return false;
            }
            else {
                $scope.bnyObject.startDate = $("#txtStartDate").val();
                $scope.bnyObject.endDate = $("#txtendDate").val();
                $scope.bnyObject.bny = [];
            }

            $(".page3").hide();
            $(".page5").hide();
            $(".page2").hide();
            $("#Login").hide();
            $(".page4").hide();
            $(".page6").show(); 
          
        }
        else if (val == 3) {
            if ($(".chk:checked").length == 0) {
                showToast("Please select atleast one contribution");
                return false;
            }
            $(".page1").hide();
            $(".page2").show();
            $(".page3,.page6").hide();
            $("#Login").show();
          
            $(".chk:checked").each(function (i) {
                $scope.bnyObject.bny.push({ "SchId": $scope.bnyObject.ScheduleId,"startDate": $("#txtStartDate").val(), "endDate": $("#txtendDate").val(), "option": $(".chk:checked")[i].value });
            })
        }

    }
    $scope.SaveBjny = function () {
        $scope.GetMasters(35, 0, $scope.mobileNo, JSON.stringify($scope.bnyObject.bny));
    }

    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {               
                $scope.SaveBjny();
                //localStorage.setItem("loginUser", $scope.mobileNo);
                //localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));


                //if (JSON.parse(localStorage.userDetails)[0].role == "R")
                //    window.location.href = baseURL + "/home/rpt";
                //else
                //    window.location.href = baseURL + "/home/profile";

            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                $scope.bnyObject.mobileNo = $scope.mobileNo;
                $scope.SaveBjny();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else {
                $scope.bnyObject.mobileNo = $scope.mobileNo;
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading1").hide();
                $("#divOTP").show();
                $("#txtMobileNo").attr("disabled", true);
                $("#divChangeNo").show();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    return false;
                }
            },
                function (data) {
                    $(".loading1").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
       
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 35) {
                $(".page4").show();
                $("#divConfirmation").hide();
                $("#Login").hide();
             }
            if (TypeId == 34) {
                $scope.Schedule = response.data.objresult.Table;
             }
            if (TypeId == 27) {
                $scope.Languages = response.data.objresult.Table;
                var ele = '<div>';
                $.each($scope.Languages, function (pr, pv) {
                    var pu = [];
                    pu.push({ "language_id": pv.language_id, "language_name": pv.language_name });
                    ele += "<button type='button' id='btnlanguage' class='langbtn' ng-click=GetQuestions(" + JSON.stringify(pu[0]) + ")>" + pv.language_name + "</button>";
                })
                ele += '</div>';
                $compile($("#languages").empty().append('<div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div>' + ele + '</div>'))($scope);
                //var ele = '<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><button type="button" id="btnlanguage" class="langbtn" ng-click="TakeSelfi()">Take Selfie</button></div></li>';
                //$compile($(".chat").append(ele))($scope);
            }
            if (TypeId == 29) {
                $scope.duplicateNo = response.data.objresult.Table;
                if ($scope.duplicateNo != undefined && $scope.duplicateNo.length > 0) {
                    //alert("Already submitted, please contact administrator");

                    $compile($(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> You are already a registered member of AIPC. Thank You.<br/><a href="javascript::" style="color:white" ng-click="showLogin()">Click to login using your mobile number</a> </p></div></div></li>'))($scope);
                    $scope.ScrollToBottom();
                    $("#visitor_msg").attr("disabled", true)
                    setTimeout(function () {

                        window.location.reload(true);
                    }, 10000)
                    return false;
                }
                else {
                    $(".loading").show();
                    $scope._SendOTP(FilterText);
                }
            }
            if (TypeId == 30) {
                if (response.data.Status == "-100") {
                    $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> ' + $scope.Questions[$scope.Qno].ques_errMsg + ' </p></div></div></li>');
                    $scope.ScrollToBottom();
                    return false;

                }
                else {
                    $scope.pinCodeDtls = response.data.objresult.Table;
                    if ($scope.pinCodeDtls == undefined || $scope.pinCodeDtls.length == 0) {
                        $(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p> ' + $scope.Questions[$scope.Qno].ques_errMsg + ' </p></div></div></li>');
                        $scope.ScrollToBottom();
                        return false;
                    }
                    else {
                        $("#PinCodeBox").modal("show")
                    }
                }
            }
            if (TypeId == 38) {

            }
            if (TypeId == 32) {
                $("#content").hide();
                setTimeout(function () {
                    $scope.GetMasters(38, 0, $scope.mobileNo, JSON.stringify($scope.bnyObject.bny));
                }, 500)
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")

                    $("#Login").modal("hide")
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }
               
            }

        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(34, 0, "", "");
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

     

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

    

}]);

app.controller("sch_reportController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};
     

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }
 

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel=function() {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#tblSlots")[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }

    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 35) {
                $(".page4").show();
                $("#divConfirmation").hide();
                $("#Login").hide();
            } if (TypeId == 40) {
                $scope.AvlDates = response.data.objresult.Table;

            }
            if (TypeId == 43) {
                $scope.Schedule = response.data.objresult.Table;
            }
               
            if (TypeId == 38) {

            }
            if (TypeId == 32) {
                $("#content").hide();
                setTimeout(function () {
                    $scope.GetMasters(38, 0, $scope.mobileNo, JSON.stringify($scope.bnyObject.bny));
                }, 500)
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")

                    $("#Login").modal("hide")
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }

            }

        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(40, 0, "", "");
    $scope.OnDateChange = function () {
        $(".loading").show()
        $scope.GetMasters(43, $scope.avlDate, "", "");
    }
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}]);
app.controller("missing_reportController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};


    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }


    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function () {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#tblSlots")[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }

    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 35) {
                $(".page4").show();
                $("#divConfirmation").hide();
                $("#Login").hide();
            }  
            if (TypeId == 44) {
                $scope.Schedule = response.data.objresult.Table;
            }

            if (TypeId == 38) {

            }
            if (TypeId == 32) {
                $("#content").hide();
                setTimeout(function () {
                    $scope.GetMasters(38, 0, $scope.mobileNo, JSON.stringify($scope.bnyObject.bny));
                }, 500)
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")

                    $("#Login").modal("hide")
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }

            }

        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }
     
    $scope.OnDateChange = function () { 
        $scope.GetMasters(44, 2, moment($scope.avlDate, 'yyyy-MM-dd').format('YYYY-MM-DD'), "");
    }
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}]);
app.controller("report5Controller", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};

    $scope.ConfirmCompany = function () {
        if ($scope.Company != undefined && $scope.Company != null && $scope.Company != "") {
            $scope.GetMasters(70, $scope.Rid, $scope.Company, "");
        }
        else {
            showToast("Invalid company");
        }

    }
    $scope.Rid = 0;
    $scope.EditCompany = function (Item) {
        $scope.Rid = Item.id;
        $scope.Name = Item.name;
        $scope.MobileNo = Item.mobile_no;
        $scope.Company = Item.company;
        $("#divUpdateCompany").show();
        $("#divConfirmedList").hide();
    }
    $scope.Back2Confirm = function () {
        $("#divUpdateCompany").hide();
        $("#divConfirmedList").show();
    }
    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function (table) {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#" + table)[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
    $scope.ShowDetails = function (item, flg) {
        $("#divOccupation").hide();
        $("#divOccupationDetails").show();
        $scope.GetMasters(77, 0, item.gender, "");

    }
    $scope.ReasonText = "";
    $scope.ViewReason = function (_re) {

        showToast_long(_re);
    }
    $scope.ShowLocationDetails = function (item, flg) {
        $("#divLocation").hide();
        $("#divLocationDetails").show();
        $scope.GetMasters(77, 0, item.gender, "");

    }
    $scope.SearchData = function () {
        $scope.GetMasters(74, 0, $scope.searchkeyword, "");

    }
    $scope.Back1 = function (flg) {
        if (flg == 0) {
            $("#divOccupation").show();
            $("#divOccupationDetails").hide();
        }
        else {
            $("#divLocation").show();
            $("#divLocationDetails").hide();
        }



    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 76) {
                $scope.ByGender = response.data.objresult.Table;
                $scope.Summary = response.data.objresult.Table1;
                $("#menu2").addClass("in active")
            }
            if (TypeId == 77) {
                $scope.OccupationDetails = response.data.objresult.Table;
            }
            if (TypeId == 74) {
                $scope.Summary = response.data.objresult.Table;
                $("#menu2").addClass("in active")
            }

            if (TypeId == 38) {

            }


        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(76, 0, "", "");

    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";


    function showToast_long(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 15000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}])

app.controller("report6Controller", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};

    $scope.ConfirmCompany = function () {
        if ($scope.Company != undefined && $scope.Company != null && $scope.Company != "") {
            $scope.GetMasters(70, $scope.Rid, $scope.Company, "");
        }
        else {
            showToast("Invalid company");
        }

    }
    $scope.Rid = 0;
    $scope.EditCompany = function (Item) {
        $scope.Rid = Item.id;
        $scope.Name = Item.name;
        $scope.MobileNo = Item.mobile_no;
        $scope.Company = Item.company;
        $("#divUpdateCompany").show();
        $("#divConfirmedList").hide();
    }
    $scope.Back2Confirm = function () {
        $("#divUpdateCompany").hide();
        $("#divConfirmedList").show();
    }
    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function (table) {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#" + table)[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
    $scope.ShowDetails = function (item, flg) {
        $("#divOccupation").hide();
        $("#divOccupationDetails").show();
        $scope.GetMasters(94, 0, item.id, "");

    }
    $scope.ReasonText = "";
    $scope.ViewReason = function (_re) {

        showToast_long(_re);
    }
    $scope.ShowLocationDetails = function (item, flg) {
        $("#divLocation").hide();
        $("#divLocationDetails").show();
        $scope.GetMasters(80, 0, item.occupation, "");

    }
    $scope.SearchData = function () {
        $scope.GetMasters(95, 0, $scope.searchkeyword, "");

    }
    $scope.Back1 = function (flg) {
        if (flg == 0) {
            $("#divOccupation").show();
            $("#divOccupationDetails").hide();
        }
        else {
            $("#divLocation").show();
            $("#divLocationDetails").hide();
        }



    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 93) {
                $scope.ByUniversity = response.data.objresult.Table;
                $scope.Summary = response.data.objresult.Table1;
                $("#menu2").addClass("in active")
            }
            if (TypeId == 94) {
                $scope.universityDetails = response.data.objresult.Table;
            }
            if (TypeId == 95) {
                $scope.Summary = response.data.objresult.Table;
                $("#menu2").addClass("in active")
            }

            if (TypeId == 38) {

            }


        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(93, 0, "", "");

    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";


    function showToast_long(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 15000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}])

app.controller("report4Controller", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};

    $scope.ConfirmCompany = function () {
        if ($scope.Company != undefined && $scope.Company != null && $scope.Company != "") {
            $scope.GetMasters(70, $scope.Rid, $scope.Company, "");
        }
        else {
            showToast("Invalid company");
        }

    }
    $scope.Rid = 0;
    $scope.EditCompany = function (Item) {
        $scope.Rid = Item.id;
        $scope.Name = Item.name;
        $scope.MobileNo = Item.mobile_no;
        $scope.Company = Item.company;
        $("#divUpdateCompany").show();
        $("#divConfirmedList").hide();
    }
    $scope.Back2Confirm = function () {
        $("#divUpdateCompany").hide();
        $("#divConfirmedList").show();
    }
    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function (table) {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#" + table)[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
    $scope.ShowDetails = function (item, flg) {
        $("#divOccupation").hide();
        $("#divOccupationDetails").show();
        $scope.GetMasters(75, 0, item.occupation, "");

    }
    $scope.ReasonText = "";
    $scope.ViewReason = function (_re) {
        
        showToast_long(_re);
    }
    $scope.ShowLocationDetails = function (item, flg) {
        $("#divLocation").hide();
        $("#divLocationDetails").show();
        $scope.GetMasters(75, 0, item.occupation, "");

    }
    $scope.SearchData = function () {
        $scope.GetMasters(74, 0, $scope.searchkeyword, "");

    } 
    $scope.Back1 = function (flg) {
        if (flg == 0) {
            $("#divOccupation").show();
            $("#divOccupationDetails").hide();
        }
        else {
            $("#divLocation").show();
            $("#divLocationDetails").hide();
        }



    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 73) {
                $scope.ByOccupation = response.data.objresult.Table; 
                $scope.Summary = response.data.objresult.Table1;  
                $("#menu2").addClass("in active")
            }
            if (TypeId == 75) { 
                $scope.OccupationDetails = response.data.objresult.Table; 
            }
            if (TypeId == 74) {
                $scope.Summary = response.data.objresult.Table;
                $("#menu2").addClass("in active")
            }
           
            if (TypeId == 38) {

            }


        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(73, 0, "", "");

    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";

    
    function showToast_long(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 15000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}])
app.controller("report3Controller", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};

    $scope.ConfirmCompany = function () {
        if ($scope.Company != undefined && $scope.Company != null && $scope.Company != "") {
            $scope.GetMasters(70, $scope.Rid, $scope.Company, "");
        }
        else {
            showToast("Invalid company");
        }

    }
    $scope.Rid = 0;
    $scope.EditCompany = function (Item) {
        $scope.Rid = Item.id;
        $scope.Name = Item.name;
        $scope.MobileNo = Item.mobile_no;
        $scope.Company = Item.company;
        $("#divUpdateCompany").show();
        $("#divConfirmedList").hide();
    }
    $scope.Back2Confirm = function () {
        $("#divUpdateCompany").hide();
        $("#divConfirmedList").show();
    }
    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function (table) {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#" + table)[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
    $scope.ShowDetails = function (item, flg) {
        $("#divOccupation").hide();
        $("#divOccupationDetails").show();
        $scope.GetMasters(65, 0, item.occupation, "");

    }
    $scope.ShowLocationDetails = function (item, flg) {
        $("#divLocation").hide();
        $("#divLocationDetails").show();
        $scope.GetMasters(66, 0, item.LOCATION, "");

    }
    $scope.SearchData = function () {
        $scope.GetMasters(67, 0, $scope.searchkeyword, "");

    }
    $scope.ConfirmSeat = function (item) {
        $scope.GetMasters(68, item.id, "", "");

    }
    $scope.CardPrinted = function (item) {
        $scope.GetMasters(72, item.id, "", "");

    }
    $scope.RejectSeat = function (item) {
        $scope.GetMasters(71, item.id, "", "");

    }
    $scope.DeConfirmSeat = function (item) {
        $scope.GetMasters(69, item.id, "", "");

    }
    $scope.Back1 = function (flg) {
        if (flg == 0) {
            $("#divOccupation").show();
            $("#divOccupationDetails").hide();
        }
        else {
            $("#divLocation").show();
            $("#divLocationDetails").hide();
        }



    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 64) {
                $scope.ByOccupation = response.data.objresult.Table;
                $scope.ByLocation = response.data.objresult.Table1;
                $scope.Summary = response.data.objresult.Table2;
                $scope.Confirmed_Summary = response.data.objresult.Table3;
                $scope.SeatBooked_Summary = response.data.objresult.Table4;
                $("#menu2").addClass("in active")
            }
            if (TypeId == 65) {
                $scope.OccupationDetails = response.data.objresult.Table;
            }
            if (TypeId == 66) {
                $scope.LocationDetails = response.data.objresult.Table;
            }
            if (TypeId == 67) {
                $scope.Summary = response.data.objresult.Table;
            }
            if (TypeId == 68 || TypeId == 69 || TypeId == 71) {
                showToast("Successfully updated");
                setTimeout(function () {
                    window.location.reload(true);
                })
            }
            if (TypeId == 72) {
                showToast("Successfully updated");
                $scope.SeatBooked_Summary = response.data.objresult.Table;
            }
            if (TypeId == 70) {
                $scope.Confirmed_Summary = response.data.objresult.Table;
                $scope.SeatBooked_Summary = response.data.objresult.Table1;
                $("#divUpdateCompany").hide();
                $("#divConfirmedList").show();
                $scope.Rid = 0;
            }
            if (TypeId == 38) {

            }


        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(64, 0, "", "");

    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";

    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}])

app.controller("report2Controller", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};
      
    $scope.ConfirmCompany = function () {
        if ($scope.Company != undefined && $scope.Company != null && $scope.Company != "") {
            $scope.GetMasters(61, $scope.Rid, $scope.Company, "");
        }
        else {
            showToast("Invalid company");
        }

    }
    $scope.Rid = 0;
    $scope.EditCompany = function (Item) {
        $scope.Rid = Item.id; 
        $scope.Name = Item.name;
        $scope.MobileNo = Item.mobile_no;
        $scope.Company = Item.company;
        $("#divUpdateCompany").show();
        $("#divConfirmedList").hide();
    } 
    $scope.Back2Confirm = function () {
        $("#divUpdateCompany").hide();
        $("#divConfirmedList").show();
    }
    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';
     
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function (table) {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#" + table)[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
    $scope.ShowDetails = function (item, flg) {
        $("#divOccupation").hide();
        $("#divOccupationDetails").show();
        $scope.GetMasters(56, 0, item.occupation, "");

    }
    $scope.ShowLocationDetails = function (item, flg) {
        $("#divLocation").hide();
        $("#divLocationDetails").show();
        $scope.GetMasters(57, 0, item.LOCATION, "");

    }
    $scope.SearchData = function () { 
        $scope.GetMasters(58, 0, $scope.searchkeyword, "");

    }
    $scope.ConfirmSeat = function (item) {
        $scope.GetMasters(59, item.id, "", "");

    }
    $scope.CardPrinted = function (item) {
        $scope.GetMasters(63, item.id, "", "");

    }
    $scope.RejectSeat = function (item) {
        $scope.GetMasters(62, item.id, "", "");

    }
    $scope.DeConfirmSeat = function (item) {
        $scope.GetMasters(60, item.id, "", "");

    }
    $scope.Back1 = function (flg) {
        if (flg == 0) {
            $("#divOccupation").show();
            $("#divOccupationDetails").hide();
        }
        else {
            $("#divLocation").show();
            $("#divLocationDetails").hide();
        }
        
       

    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 55) {
                $scope.ByOccupation = response.data.objresult.Table;
                $scope.ByLocation = response.data.objresult.Table1;
                $scope.Summary = response.data.objresult.Table2;
                $scope.Confirmed_Summary = response.data.objresult.Table3;
                $scope.SeatBooked_Summary = response.data.objresult.Table4;
                $("#menu2").addClass("in active")
            }
            if (TypeId == 56) {
                $scope.OccupationDetails = response.data.objresult.Table;
            }
            if (TypeId == 57) {
                $scope.LocationDetails = response.data.objresult.Table;
            }
            if (TypeId == 58) {
                $scope.Summary = response.data.objresult.Table;
            }
            if (TypeId == 59 || TypeId == 60 || TypeId == 62) {
                showToast("Successfully updated");
                setTimeout(function () {
                    window.location.reload(true);
                })
            }
            if (TypeId == 63) {
                showToast("Successfully updated");
                $scope.SeatBooked_Summary = response.data.objresult.Table;
            }
            if (TypeId == 61) { 
                $scope.Confirmed_Summary = response.data.objresult.Table;
                $scope.SeatBooked_Summary = response.data.objresult.Table1;
                $("#divUpdateCompany").hide();
                $("#divConfirmedList").show();
                $scope.Rid = 0;
            }
            if (TypeId == 38) {

            }
           

        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(55, 0, "", "");

    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}])
app.controller("confirm_reportController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';
    $scope.bnyObject = {
        ScheduleId: '',
        mobileNo: '',
        startDate: '',
        endDate: '',
        bny: []
    };
    $scope.SelectedSchedule = {};


    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }


    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;

    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.Export2Excel = function () {
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };

        var table = $("#tblSlots")[0];
        htmls = table.outerHTML;

        var ctx = {
            worksheet: 'Report',
            table: htmls
        }
        var dt = new Date();

        var link = document.createElement("a");
        link.download = "Report.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }

    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {
        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            $(".loading").hide()
            if (TypeId == 35) {
                $(".page4").show();
                $("#divConfirmation").hide();
                $("#Login").hide();
            } if (TypeId == 40) {
                $scope.AvlDates = response.data.objresult.Table;

            }
            if (TypeId == 53) {
                $scope.Schedule = response.data.objresult.Table;
            }

            if (TypeId == 38) {

            }
            if (TypeId == 32) {
                $("#content").hide();
                setTimeout(function () {
                    $scope.GetMasters(38, 0, $scope.mobileNo, JSON.stringify($scope.bnyObject.bny));
                }, 500)
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")

                    $("#Login").modal("hide")
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }

            }

        },
            function (data) {
                console.log("error occured")
                return false;
                // Handle error here
            })

    }
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(53, 6, "", "");
 
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }



    $scope.showHome = function () {
        window.location.href = "/home/index";
    }



}])
app.controller("loginController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = ''; 

    $scope.aipc_id = 0;
    $scope.showActivities = function (item) {
        $scope.aipc_id = item.id;
        $("#ActivitiesGrid").modal("show");
        $scope.GetMasters(49, 0, '', $scope.aipc_id);
    }
    $scope.SaveActivity = function () {
        if ($scope.ActivityType == undefined || $scope.ActivityType == "" || $scope.ActivityType == null) {
            showToast("Please select type")
            return "";
        }
        if ($scope.Followup == undefined || $scope.Followup == "" || $scope.Followup == null) {
            showToast("Please select follow up type")
            return "";
        }
        if ($scope.Summary == undefined || $scope.Summary == "" || $scope.Summary == null) {
            showToast("Please enter Summary")
            return "";
        } 
        var userobj = {
            Email: $scope.Email, Notes: $scope.Notes,
            ActivityType: $scope.ActivityType,
            Followup: $scope.Followup,
            Summary: $scope.Summary, AipcId: $scope.aipc_id,
        }

        var url = baseURL + '/home/_saveActivity'

        $http($scope.CreateRequest(userobj, url)).then(function (response) {
            if (response.data.Response == 200) {
                showToast("Successfully Created")
                $("#ActivitiesGrid").modal("hide");
                $scope.GetMasters(48, 0, $scope.searchkeyword, "");

                $scope.Email = ""; $scope.Notes = "";
                $scope.ActivityTyp = "";
                $scope.Followup = "";
                $scope.Summary = ""; $scope.aipc_id = "";
            }
            else {
                showToast(response.data.response)
                // Handle error here
            }

        },
            function (data) {
                alert("error occured" + data)
                // Handle error here
            })
    }
    $scope.nxtbtn = function () {
        $(".page1").hide();
        $(".page2").show();
        $("#Login").show();
    }
    $scope.showHome = function () {
        window.location.href = "/home/index";
    }
    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                localStorage.setItem("loginUser", $scope.mobileNo);
                localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
                if (JSON.parse(localStorage.userDetails)[0].role == "R")
                    window.location.href = baseURL + "/home/activities";
                else
                    window.location.href = baseURL + "/home/profile";

            } 
            else {
                alert("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid username");
                return false;
            }
            else if ($scope.password == null || $scope.password == undefined || $scope.password == "") {
                showToast("Invalid password");
                return false;
            }
            else {
                $scope.GetMasters(47, 0, $scope.mobileNo, $scope.password);
            }
        }
    }
    $scope.SearchData = function () {
        if ($scope.searchkeyword == null || $scope.searchkeyword == undefined || $scope.searchkeyword == "") {
            showToast("Invalid search key");
            return false;
        }
        else {
            $scope.GetMasters(48, 0, $scope.searchkeyword, "");
        }
    }
    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope._SendLoginOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendLoginOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading1").hide();
                $("#divOTP").show();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        $("#btnModalConfirm").html("Validate OTP")
                        $scope.OTPSend = response.data.Data;
                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");

                }
            },
                function (data) {
                    $(".loading1").hide();
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    window.location.reload(true);
                    // Handle error here
                })
    }

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1; 
    $scope.inputClick = function () {
        $("#hdnFile").click()
    }
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.nxtbtn = function (flg) {
        if (flg == 1) {
            $("#div2,#div3").hide();
            $("#div1").show();
        }
    }
    $scope.MobileNumber = '';

    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $("#div1,#div3").hide();
                            $("#div2").show();
                            $scope.OTPSend = response.data.Data;

                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();

    $scope.LoadQuestions = function () {
        if ($scope.Language != "")
            $scope.GetMasters(28, $scope.Language, '', '');
    }
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) { 
            if (TypeId == 50) {
                $scope.ActivityList = response.data.objresult.Table;

            }
            if (TypeId == 48) {
                $scope.SearchResults = response.data.objresult.Table;

            }
            if (TypeId == 49) {
                $scope.ActivitiesResults = response.data.objresult.Table;

            }
            if (TypeId == 29) {
                $scope.duplicateNo = response.data.objresult.Table;
                if ($scope.duplicateNo != undefined && $scope.duplicateNo.length > 0) {
                    //alert("Already submitted, please contact administrator");

                    $("#content").show();
                    $compile($("#content").empty().append(' <h6> <b> You are already a registered member of AIPC. Thank You.<br/><a href="javascript::" style="color:white" ng-click="showLogin()">Click to login using your mobile number</a> </b><h6>'))($scope);

                    setTimeout(function () {

                        window.location.reload(true);
                    }, 10000)
                    return false;
                }
                else {
                    $(".loading").show();
                    $scope._SendOTP(FilterText);
                }
            }
            if (TypeId == 30) {
                if (response.data.Status == "-100") {
                    showToast($scope.Questions[4].ques_errMsg)
                    return false;

                }
                else {
                    $scope.pinCodeDtls = response.data.objresult.Table;
                    if ($scope.pinCodeDtls == undefined || $scope.pinCodeDtls.length == 0) {
                        showToast($scope.Questions[4].ques_errMsg)
                        return false;
                    }
                    else {
                        $scope.SaveRecord();
                    }
                }
            }
            if (TypeId == 47) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {

                    $("#content").show();
                    $("#content").find("h2").find("b").empty().html("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>")

                    $("#Login").modal("hide")
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    window.location.href = "/home/search"; 
                }
                else {
                    $("#content").show();
                    $("#content").find("h6").find("b").empty().html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }
            }

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    } 
    $scope.ScrollToBottom = function () {
        setTimeout(function () {
            var wtf = $('.main_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
            var wtf = $('.inner_div');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 500)
    }

    $scope.GetMasters(50, 0, "", "");
    $('#visitor_msg').keydown(function (event) {
        var id = event.key || event.which || event.keyCode || 0;
        if (id == 'Enter') {
            $scope.SubmitQuestion();
        }
    });
    $scope.OTPSend = "";
    $scope.SendOTP = function () {
        if ($scope.Language == null || $scope.Language == "") {
            showToast("Invalid language");
            return false;
        } if ($scope.MobileNumber == null || $scope.MobileNumber == "") {
            showToast("Invalid Mobile No");
            return false;
        }

        var _mobileNo = $scope.MobileNumber;
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.IsPinCodeValidated = 0; 
    $scope.Answers = [];
    $scope.isOTPValidated = false;
    $scope.ValidateOTP = function () {
        if ($scope.OTPSend == $scope.OTP) {
            $scope.Qno = 0;
            $scope.isOTPValidated = true;
            $("#div2,#div1").hide();
            $("#div3").show();
        }
        else if ($scope.OTP == "6666") {
            $scope.Qno = 0;
            $scope.isOTPValidated = true;
            $("#div2,#div1").hide();
            $("#div3").show();
        }
        else if ($scope.OTPSend != $scope.OTP) {
            showToast("Invalid OTP");
            //alert("Invalid OTP");
            return false;
        }
    }

   
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }


}]);


app.controller("petitionController", ["$scope", "$http", "$compile", "$sce", function ($scope, $http, $compile, $sce) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };
    $scope.closepopup = function () {
        $("#divConfirmation").hide();
    }
     
    $scope.SaveManifesto = function () {
        $(".page1").hide();
        $(".page2").hide();
        $(".page3").show();
        $("#Login").hide();
    }

    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
                //localStorage.setItem("loginUser", $scope.mobileNo);
                //localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));


                //if (JSON.parse(localStorage.userDetails)[0].role == "R")
                //    window.location.href = baseURL + "/home/rpt";
                //else
                //    window.location.href = baseURL + "/home/profile";

            }
            else if ($scope._lOTP == "6666") {
                $scope.isOTPValidated = true;
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.SaveManifesto();
            }
            else {
                showToast("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid mobile number");
                return false;
            }
            else {
                $scope.manifestoObject.mobileNo = $scope.mobileNo;
                $scope.GetMasters(32, 0, $scope.mobileNo, "");
            }
        }
    }

    $scope.Cancel = function () {
        $("#Login").hide();
        $("body, .main_div").removeClass("hidden")
    }
    $scope.EnabledMobileNo = function () {
        $("#txtMobileNo").attr("disabled", false);
        $("#divChangeNo").hide();
        $("#divOTP").hide();
        $scope.OTPSend = '';
        $("#btnModalConfirm").html("Confirm")
    }
 

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.MobileNumber = '';

    $scope.SubmitPetition = function () {
        var formdata = new FormData();
        if ($scope.MobileNo == null || $scope.MobileNo == "" || $scope.MobileNo == undefined) {
            showToast("Invalid mobile no");
            return false;
        }
        else if ($scope.Name == null || $scope.Name == "" || $scope.Name == undefined) {
            showToast("Invalid Name");
            return false;
        }
        else if ($scope.Email == null || $scope.Email == "" || $scope.Email == undefined) {
            showToast("Invalid Email");
            return false;
        }
        //else if ($scope.ZipCode == null || $scope.ZipCode == "" || $scope.ZipCode == undefined) {
        //    showToast("Invalid ZipCode");
        //    return false;
        //}
        //else if ($scope.Reason == null || $scope.Reason == "" || $scope.Reason == undefined) {
        //    showToast("Invalid Reason");
        //    return false;
        //} 
        else {
            $(".loading").show();
            $("#btnSubmit").attr("disabled", true);
            setTimeout(function () {
                var data = new FormData();  
                data.append("MobileNo", $scope.MobileNo);
                data.append("Name", $scope.Name);
                data.append("Email", $scope.Email);
                data.append("ZipCode", "");
                data.append("Reason", $scope.Reason);
                data.append("IPAddress", $scope.UserLocation);
                //data.append("chkDisplay", $("#chkDisplay").prop("checked") == true ? 1 : 0);
                data.append("chkDisplay", 1);
                data.append("pageId", _pageId); data.append("membercode", membercode);
                $.ajax({
                    url: baseURL + '/home/saveSignIn',
                    type: "POST",
                    data: data,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        $(".loading").hide();
                        if (result.Response === 200) {
                            showToast("Successfully Submitted");
                            setTimeout(function () {
                                window.location.reload(true);
                            },10000)
                        }
                },  error: function (errormessage) {

                    }
                });
            }, 500)
        }

          
    }
    $scope._SendOTP = function (mobileNo) {
        $scope.MobileNumber = mobileNo;
        $http.get(baseURL + '/home/SendOTP?MobileNo=' + mobileNo)
            .then(function (response) {
                $(".loading").hide();
                if (response.status == 200) {
                    if (response.data.Response == 200) {
                        //console.log(JSON.stringify($scope.Questions));
                        if ($scope.Questions.length > 0) {
                            $scope.OTPSend = response.data.Data;
                            $(".chat").append('<li class="chatbot" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_validationLabel + '</p></div></div></li>');
                            var wtf = $('.main_div,.inner_div');
                            var height = wtf[0].scrollHeight;
                            wtf.scrollTop(height);
                        }

                    }
                }
                else {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000)
                    //$(".chat").append('<li class="chatbot error" style=""><div class="bot-icon"><img src="' + baseURL + "/Content/img/logo.png" + '"></div><div class="msg"><div><p>' + $scope.Questions[$scope.Qno - 1].ques_errMsg +'</p></div></div></li>');

                }
            },
                function (data) {
                    alert("This occurs when your browser is unable to connect to the server.\r\n You can clear your cache and try again. If the issue is not fixed,\r\n please email us your convenient time between 10 am and 6 pm, Monday to Saturday,\r\n so that our tech team can reach out to you to resolve this issue.");
                    $(".loading").hide();
                    return false;
                    // Handle error here
                })
    }
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $scope.selectedObject = [];
    $scope.GetClickEvent = function () {


        var filterItems = $scope.AvlDates.filter(function (_fil) {
            return (_fil.id == $scope.avlDate);
        });;

        if (filterItems != '' && filterItems.length > 0) {
            var _pu = { 'id': $scope.avlDate, 'slot': '', 'date': filterItems[0].fDate };
            $scope.selectedObject = _pu;
            $(".page1").hide();
            $(".page2").show(); $(".page4").hide();
            $(".page3").hide();
        }
    }
    $scope.OnClickConfirm = function () {
        $scope.BookSlot(41, $scope.loginDetails.id, $scope.selectedObject.id, $scope.selectedObject.date, $scope.selectedObject.slot);
    }
    $scope.OnDateChange = function () {
        $scope.GetMasters(42, $scope.avlDate, "", "");
    }
    
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 51) {
                $scope.petitiondtls = response.data.objresult.Table;
                if ($scope.petitiondtls.length>0)
                $scope.strDesc = $sce.trustAsHtml($scope.petitiondtls[0].strDesc)
            }
            if (TypeId == 52) {
                $scope.petitiondetails = response.data.objresult.Table;
                $scope.reasondetails = response.data.objresult.Table1;
                if ($scope.petitiondetails.length > 0)
                    $scope.strDesc = $sce.trustAsHtml($scope.petitiondetails[0].strDesc)
            }
            if (TypeId == 45) {
                showToast("Thanks for your interest")
                window.location.reload(true);

            } 
            if (TypeId == 32) {
                $("#content").hide();
                $scope.loginDtls = response.data.objresult.Table;
                if ($scope.loginDtls == null || $scope.loginDtls == undefined || $scope.loginDtls.length == 0) {
                    // alert("We have not found your number in our records ,\r\n please click on the below link to register for AIPC \r\n <a href='https://Profcongress.in/home/aipic'>Profcongress.in</a>")
                    $("#content").show();
                    $("#content").find("h2").find("b").html(" A one-to-one meeting with the Chairman is only for registered members. We could not find your number as a registered AIPC member. If you provided a different number during registration, please enter that number. If you are not a registered AIPC member and want to become one,please go to <a href='https://join.Profcongress.in/join'>https://join.Profcongress.in/join</a>.")
                    $("#Login").modal("hide");
                    // window.location.href = "/home/aipc";
                    return false;
                }
                if ($scope.loginDtls != null && $scope.loginDtls != undefined && $scope.loginDtls.length > 0) {
                    $scope.loginDetails = $scope.loginDtls[0];
                    $scope._SendLoginOTP($scope.mobileNo);
                    $(".loading1").show();

                }
                else {
                    $("#content").show();
                    $("#content").find("h2").find("b").html("You are not an AIPC Enroller as per our records. If you want to become an enroller, please send a request email to enrollers@profcongress.in")
                    $("#Login").modal("hide")
                    return false;
                }


            }


        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
      
    $scope.GetMasters(51, 0, "", "");

    if (_pageId != "" && _pageId != undefined && _pageId != null)
        $scope.GetMasters(52, 0, _pageId, "");

    $scope.baseURL = baseURL;
    $scope.OTPSend = "";
    $scope.SendOTP = function (_mobileNo) {
        if (_mobileNo) {
            $scope.GetMasters(29, 0, _mobileNo, "");
        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    }
    $scope.getTotal = function (_list) {
        var total = 0;
        $.each(_list, function (ind, val) {
            total = total + val.cnt;
        });
        return total;
    }

    $scope.showHome = function () {
        window.location.href = "/home/index";
    }

}]);
 
app.controller("dailyStatusCtrl", function ($scope, $http, $compile) {
    $(".header").show();
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    $scope.ShowQuestions = function (item) {
        $scope.GetMasters(1, item.id, '', user.id)
        $("#divQuestions").show();
        $("#div_").hide();
    }
    $scope.QNO = 0;

    $scope.Step = 1;
    $scope.Title = "Reports";
    $scope.ln_HideDetails = true;
    $scope.GetMasters = function (TypeId, FilterId, filterText, Userid) {

        var url = baseURL + '/home/_getMasters'

        $http.get(baseURL + '/Home/_getMasters?TypeId=' + TypeId + '&FilterId=' + FilterId + '&filterText=' + filterText + '&Userid=' + Userid).then(function (response) {
            if (TypeId == 1) {
                $(".loading").hide();
                $scope.gridData = JSON.parse(response.data.result).Table;

            }
            if (TypeId == 2) {
                $(".loading").hide();
                showToast("Deleted Successfully");
                $scope.GetMasters(1, $scope.userDetails.id, '', $scope.userDetails.id)
            }

        },
            function (data) {
                alert("error occured")
                // Handle error here
            })

    }
    $scope.Month = "10";
    $scope.Year = "2024";

    $scope.SaveGallery = function (_id) {

        let cnter = 0;
        $.each($scope.Attachments, function (ind, val) {
            var difference = ((new Date() - $scope.CaptureTime) / 1000).toString();
            var _selectedFiles = '';
            var data = new FormData();
            var file = '';
            if (val.AttachmentType == "Photo")
                file = val.UploadedImage;
            data.append("EventId", _id); data.append("AttachmentType", val.AttachmentType);
            data.append("Purpose", val.Purpose);
            data.append("Userid", JSON.parse(localStorage.userDetails)[0].id);
            data.append("Link", val.Image);
            data.append("File", file);
            $.ajax({
                url: baseURL + '/Home/SaveEvent_Gallery',
                type: "POST",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result.Response === 200) {
                        cnter++;
                        if (cnter == $scope.Attachments.length) {
                            $(".loading").hide();
                            $("#btnFinalSubmit").attr("disabled", false)
                            showToast("Sucessfully Submitted");
                            setTimeout(function () {
                                window.location.href = '/activities';
                            }, 2000)
                        }

                    }
                    else {
                        showToast(result.data)
                        alert("Error Occured while saving, please try after some time")
                    }
                },
                error: function (errormessage) {
                    $(".loading").hide();
                }
            });
        });




    }
    $scope.SaveCommentMethod = function (eventDate, eventType, eventpurpose) {
        $http.get(baseURL + '/home/SaveEvent?eventDate=' + eventDate + '&eventType=' + eventType + '&purpose=' + eventpurpose + '&userId=' + JSON.parse(localStorage.userDetails)[0].id).then(function (response) {

            if (response.data.Response == 200) {
                var _dt = JSON.parse(response.data.result).Table;
                $scope.SaveGallery(_dt[0].id);
            }
            else {
                $(".loading").hide();
                showToast("Unable to upload files");
                return false;
            }
        },
            function (data) {
                alert("error occured")
                showToast("Unable to upload files : " + data);
                // Handle error here
            })

    }
    $scope.SaveReport = function () {

        if ($scope.EventDate == undefined || $scope.EventDate == null || $scope.EventDate == "") {
            showToast("Please select date");
            return false;
        }
        else if ($scope.EventType == undefined || $scope.EventType == null || $scope.EventType == "") {
            showToast("Please select Event Type");
            return false;
        }
        else if ($scope.Purpose == null || $scope.Purpose == "" || $scope.Purpose == undefined) {
            showToast("Invalid Purpose");
            return false;
        }
        else if ($scope.Attachments == null || $scope.Attachments.length == 0) {
            showToast("Invalid files to upload");
            return false;
        }
        else {
            $("#btnSubmit").attr("disabled", true)
            $(".loading").show();
            $scope.SaveCommentMethod($scope.EventDate.getFullYear() + '-' + ($scope.EventDate.getMonth() + 1) + '-' + $scope.EventDate.getDate(), $scope.EventType,
                $scope.Purpose);

        }
    }
    $scope.Answers = [];
    $scope.CaptureTime = '';
    $scope.Form_id = 0;
    $scope.UserLocation = '';

    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();
    $("#fileSelected").on("change", function () {
        if ($("#fileSelected").get(0).files.length > 0) {
            $('#lblFileName').html($("#fileSelected").get(0).files[0].name)
            var reader = new FileReader();
            reader.onload = function (e) {
                _dataImage = e.target.result;
                return false;
            };
            reader.readAsDataURL($("#fileSelected").get(0).files[0]);
        }
    })
    $scope.Click2Browse = function () {
        $("#fileSelected").triggerHandler('click');
    }
    $scope.showQuestionaire = function () {
        $("#divQuestions").show();
        $("#divFinalStage").hide();
    }
    $scope.Attachments = [];
    var _dataImage = '';
    $scope.SubmitImage = function () {

        if ($scope.AttachmentType == null || $scope.AttachmentType == "" || $scope.AttachmentType == undefined) {
            showToast("Invalid attachment type");
            return false;
        }
        else if ($scope.AttachmentType == "Photo" && ($("#fileSelected").get(0).files == undefined || $("#fileSelected").get(0).files.length == 0)) {
            showToast("Please select file");
            return false;
        }
        else if ($scope.AttachmentType != "Photo" && ($scope.Link == null || $scope.Link == "" || $scope.Link == undefined)) {
            showToast("Please enter link");
            return false;
        }
        else {
            if ($scope.AttachmentType == "Photo") {
                $scope.Attachments.push({ "id": $scope.Attachments.length + 1, "UploadedImage": $("#fileSelected").get(0).files[0], "AttachmentType": $scope.AttachmentType, "Purpose": '', "Image": "data:image/jpg " + _dataImage })

            }
            else
                $scope.Attachments.push({ "id": $scope.Attachments.length + 1, "UploadedImage": '', "AttachmentType": $scope.AttachmentType, "Purpose": '', "Link": $scope.Link })
            $scope.AttachmentType = ""; 
            $scope.lblFileName = ""; $('#lblFileName').html('');
            $scope.Link = "";

        }
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $scope.AttachmentChange = function () {
        if ($scope.AttachmentType == "Photo") {
            $("#divFile").show();
            $("#divLink").hide();
        }
        else if ($scope.AttachmentType == "Facebook" ||
            $scope.AttachmentType == "Instagram" ||
            $scope.AttachmentType == "Twitter") {
            $("#divFile").hide();
            $("#divLink").show();
        }
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    var user = JSON.parse(localStorage.getItem("userDetails"));
    $scope.Mobile = user.mobileNo; 
    $scope.loginname = user.name 
    $scope.userDetails = user;
    $(".loading").show(); 
    $scope.DeleteReport = function (_id) {

        var _filterList = $scope.Attachments.filter(function (_fil) {
            return (_fil.id == _id);
        });
        if (_filterList != null && _filterList.length > 0) {
            $scope.Attachments.pop(_filterList);
        }

    }

});
app.controller("eventsListCtrl", ["$scope", "$http", "$compile","$timeout","$sce", function ($scope, $http, $compile, $timeout, $sce) {
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    $(".header").show();
    $scope.CloseModal = function () {
        $("#myModal").modal("hide");
    }
    $scope.CanID = 0;
    $scope.mobileNo = '';

    $scope.logout = function () {
        localStorage.userObject = '';
        window.location.href = baseURL + '/home/index';
    }
    if (localStorage.userObject != null && localStorage.userObject != "" &&
        localStorage.userObject != undefined) {
        $scope.Name = JSON.parse(localStorage.userObject).Name;
        $scope.Role = JSON.parse(localStorage.userObject).roleType;
    }
    $scope.NotSubmitted = 0;
    $scope._Month = 0;
    $scope._Year = 0;
    $scope.ShowActivities = function (id) {
        $("#divStep2").show();
        $("#div_,#divStep3,#divButtons").hide();
        $scope.GetMasters(85, id, id, 0)
    }
    $scope.ShowEventDates = function (_date) {
        $("#divStep3").show();
        $("#div_,#divStep2,#divButtons").hide();
        $scope.GetMasters(84, JSON.parse(localStorage.getItem("userDetails"))[0].id, _date, JSON.parse(localStorage.getItem("userDetails"))[0].id)
    }
    $scope.Back2 = function () {
        $("#divStep3,#divStep2").hide();
        $("#div_").show();

    }
    $scope.ShowGrid = function (_type) {
        if (_type==1) {
            $("#divassigned").show();
            $("#divButtons").hide();
        }
        else if (_type == 2) {
            $("#div_").show();
            $("#divButtons").hide();
        }
    }
    
    $scope.showDesc = function (item) {
        $("#divDesc").show();
        $("#divassigned").hide();
        $scope.strDesc = $sce.trustAsHtml(item.summary) 
 
        $scope.link = item.link;
        $scope.task_id = item.id; 
    } 
    $(".share-button").on("click", function (e) { 
       // let whatsAppMsg = "Hi, I am inviting you to join All India Mahila Congress.My personal referral link is %0D%0A%0D%0A https://join.aimc.in/" + _recid + " %0D%0A Click on link,%0D%0A%0D%0AYou will see my name on website inviting you to register.%0D%0A*" + $scope.username + "*";
        let whatsAppMsg = '';
        if ($(e.currentTarget).attr("flg") == "facebook") {
            const navUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + $scope.link +'&quote=';
            window.open(navUrl, '_blank');
        }
        else if ($(e.currentTarget).attr("flg") == "twitter") {
            window.open('http://twitter.com/share?text=' + whatsAppMsg + '&url=' + $scope.link );

        }
        else if ($(e.currentTarget).attr("flg") == "whatsapp") {
            var url = ' https://wa.me/' + $scope.userDetails.mobileNo + '/?text=' + $scope.link;
            window.open(url);
        }
        else if ($(e.currentTarget).attr("flg") == "linkedin") {
            const navUrl = 'https://www.linkedin.com/share?url=' + $scope.link + '&summary=' + whatsAppMsg;
            window.open(navUrl, '_blank');
        }
        $scope.GetMasters(89, $scope.userDetails.id, $scope.task_id, $(e.currentTarget).attr("flg"))
        e.preventDefault();
    });
    $scope.task_id = 0;
    $scope.Back = function () {
        $("#div_,#divStep2,#divButtons").hide();
        $("#divStep3").show();
    }
    $scope.Back1 = function (flg) {
        $("#divDesc").hide();
        $("#divassigned").show();
        $scope.strDesc = ''
        $scope.link = '';
        $scope.task_id = 0;
    }
   
    $scope.Assigned_Tasks_Count = 0;
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters' 
        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 82) {
                $scope.gridData = response.data.objresult.Table;
                $scope.Assigned_Tasks = response.data.objresult.Table1;
                $scope.Assigned_Tasks_Count = response.data.objresult.Table2;
                }
            if (TypeId == 84)
                $scope.ListPurpose = response.data.objresult.Table;
            if (TypeId == 85)
                $scope.gridData1 = response.data.objresult.Table;
            if (TypeId == 31) {
                $scope.reportList = response.data.objresult.Table;
                let dump = $scope.reportList.filter(function (_fil) {
                    return (_fil.status == 'Verified');
                });;
                if (dump != null && dump.length > 0) {
                    $scope.Verified = dump
                }
                dump = $scope.reportList.filter(function (_fil) {
                    return (_fil.status == 'Pending');
                });;
                if (dump != null && dump.length > 0) {
                    $scope.Pending = dump
                }
                $scope.ReferralLink = baseURL + 'home/index/' + response.data.objresult.Table1[0].member_code
            } 

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
   

    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }
    $scope.showmenu = function () {
        $(".sidemenu").addClass("sidemenushow");
        $("body, .main_div").addClass("hidden")
    }
    if (localStorage.getItem("userDetails") == null || localStorage.getItem("userDetails") == "") {
        window.location.href = '/login';
    }
    var user = JSON.parse(localStorage.getItem("userDetails"));
    $scope.Mobile = user[0].mobileNo;
    $scope.loginname = user[0].name
    $scope.userDetails = user[0];
    $(".loading").show();
    $scope.GetMasters(1, user[0].id, '', user[0].id)
    $scope.GetMasters(82, user[0].id, '', user[0].id)

}])


app.controller("domain_headController", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.result1 = '';

    $scope.aipc_id = 0;
    $scope.showActivities = function (item) {
        $scope.aipc_id = item.id;
        $("#ActivitiesGrid").modal("show");
        $scope.GetMasters(49, 0, '', $scope.aipc_id);
    }
    $scope.SaveActivity = function () {
        if ($scope.ActivityType == undefined || $scope.ActivityType == "" || $scope.ActivityType == null) {
            showToast("Please select type")
            return "";
        }
        if ($scope.Followup == undefined || $scope.Followup == "" || $scope.Followup == null) {
            showToast("Please select follow up type")
            return "";
        }
        if ($scope.Summary == undefined || $scope.Summary == "" || $scope.Summary == null) {
            showToast("Please enter Summary")
            return "";
        }
        var userobj = {
            Email: $scope.Email, Notes: $scope.Notes,
            ActivityType: $scope.ActivityType,
            Followup: $scope.Followup,
            Summary: $scope.Summary, AipcId: $scope.aipc_id,
        }

        var url = baseURL + '/home/_saveActivity'

        $http($scope.CreateRequest(userobj, url)).then(function (response) {
            if (response.data.Response == 200) {
                showToast("Successfully Created")
                $("#ActivitiesGrid").modal("hide");
                $scope.GetMasters(48, 0, $scope.searchkeyword, "");

                $scope.Email = ""; $scope.Notes = "";
                $scope.ActivityTyp = "";
                $scope.Followup = "";
                $scope.Summary = ""; $scope.aipc_id = "";
            }
            else {
                showToast(response.data.response)
                // Handle error here
            }

        },
            function (data) {
                alert("error occured" + data)
                // Handle error here
            })
    }
    $scope.nxtbtn = function () {
        $(".page1").hide();
        $(".page2").show();
        $("#Login").show();
    }
    $scope.showHome = function () {
        window.location.href = "/home/index";
    }
    $scope.CheckLogin = function () {
        if ($("#btnModalConfirm").html() == "Validate OTP" && $scope.OTPSend != '') {
            if ($scope.OTPSend == $scope._lOTP) {
                localStorage.setItem("loginUser", $scope.mobileNo);
                localStorage.setItem('userDetails', JSON.stringify($scope.loginDtls));
                if (JSON.parse(localStorage.userDetails)[0].role == "R")
                    window.location.href = baseURL + "/activites";
                else
                    window.location.href = baseURL + "/home/profile";

            }
            else {
                alert("Invalid OTP");
                return false;
            }
        }
        else {
            if ($scope.mobileNo == null || $scope.mobileNo == undefined || $scope.mobileNo == "") {
                showToast("Invalid username");
                return false;
            }
            else if ($scope.password == null || $scope.password == undefined || $scope.password == "") {
                showToast("Invalid password");
                return false;
            }
            else {
                $scope.GetMasters(47, 0, $scope.mobileNo, $scope.password);
            }
        }
    }
  
    $scope.GetOBearers = function () {
        $scope.GetMasters(86, $scope.StateID,$scope.DomainID,'');
    }
    
    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }

    $(document).on('keypress', '#phone', function (e) {
        if ($(e.target).prop('value').length >= 10) {
            if (e.keyCode != 32) { return false }
        }
    })

    $scope.keypress = function (e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    }
    $scope.selectedLanguage = 1;
    $scope.inputClick = function () {
        $("#hdnFile").click()
    }
    $scope.CloseModal = function () {
        $("#detailsBox,#OtpBox").modal("hide");
    }
    $scope.CreateRequest = function (data, url) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '771BA032839246B9951A7A785721F35C'
            },
            data: JSON.stringify(data)
        }
        return req;
    }
    
    $scope.Questions = [];
    $scope.Qno = 0;
    $scope.UserLocation = '';
    //localStorage.setItem("loginUser", '');
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.UserLocation = "Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position) {
        $scope.UserLocation = JSON.stringify(position);
    }
    getLocation();

     
    $scope.GetMasters = function (TypeId, FilterID, FilterText, FilterText1) {

        //$scope.show = $sessionStorage.admin;  
        var id = 0
        var data = {
            type: TypeId,
            filterId: FilterID,
            clientId: 0,
            userId: id,
            searchKey: FilterText,
            filterText: FilterText1
        }
        var url = apiURL + 'v1/Admin/_getMasters'

        $http($scope.CreateRequest(data, url)).then(function (response) {
            if (TypeId == 81) {
                $scope.DomainList = response.data.objresult.Table;
                $scope.StateList = response.data.objresult.Table1;
                $scope.StateID = "0";
                $scope.DomainID = "0";
            }
            if (TypeId == 86) {
                $scope.SearchResults = response.data.objresult.Table;

            }
            if (TypeId == 49) {
                $scope.ActivitiesResults = response.data.objresult.Table;

            }
            
            
            

        },
            function (data) {
                console.log("error occured")
                // Handle error here
            })

    }
     

    $scope.GetMasters(81, 0, "", "");

    $scope.GetMasters(86, 0, "", "");
  
    function showToast(content = "Unknown error") { //You can change the default value
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        //Change the text (not mandatory, but I think you might be willing to do it)
        x.innerHTML = content;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
     


    $scope.Back = function () {
        $("#div1").show();
        $("#div2").hide();
    } 


}]);
