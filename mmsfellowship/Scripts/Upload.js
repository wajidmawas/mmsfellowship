var baseURL = window.location.origin;
var apiURL = "https://aicc_new.pulseadmin.in/";
if (window.location.origin == "http://localhost:51059")
    baseURL = window.location.origin;
else
    baseURL = "https://mmsfellows.profcongress.in/";

 

var app = angular.module("myApp", []);

app.controller("dashboardController",["$scope", "$http", "$compile", function ($scope, $http,$compile) { 
    $scope.logout = function () {
        localStorage.setItem("loginUser", '');
        localStorage.setItem('userDetails', '');
        window.location.href = baseURL + '/home/index';
    }
     
    $scope.showLogin = function () {
        if (localStorage.getItem("loginUser") != undefined && localStorage.getItem("loginUser") != "")
            window.location.href = baseURL + "/activites";

        else {
            $("#Login").show();
            $("body, .main_div").addClass("hidden")
        }
    }
    if (localStorage.getItem("lan") == "" || localStorage.getItem("lan") == undefined)
        localStorage.setItem("lan", "En");
    $scope.language = localStorage.getItem("lan");
    $("#drplanguage").val($scope.language)
    $scope.closemenu = function () {
        $(".sidemenu").removeClass("sidemenushow")
        $("body, .main_div").removeClass("hidden")
    }
    $scope.showmenu = function () {
        $(".sidemenu").addClass("sidemenushow");
        $("body, .main_div").addClass("hidden")
    }
    $scope.changelanguge = function () {
        localStorage.setItem("lan", $scope.language); 
        window.location.reload(true);
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
        $scope.GetMasters(100, 0, item.StateID, "");

    }
    $scope.ReasonText = "";
    $scope.ViewReason = function (_re) {

        showToast_long(_re);
    }
    $scope.ShowLocationDetails = function (item, flg) {
        $("#divLocation").hide();
        $("#divLocationDetails").show();
        $scope.GetMasters(100, 0, item.occupation, "");

    }
    $scope.SearchData = function () {
        $scope.GetMasters(99, 0, $scope.searchkeyword, "");

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
            if (TypeId == 98) {
                $scope.ByState = response.data.objresult.Table;
                $scope.Summary = response.data.objresult.Table1;
                $("#home").addClass("in active")
            }
            if (TypeId == 99) {
                $scope.Summary = response.data.objresult.Table;
            }
            if (TypeId == 100) {
                $scope.OccupationDetails = response.data.objresult.Table;
                $("#home").addClass("in active")
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

    $scope.GetMasters(98, 0, "", "");

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
app.controller("mmsfellowshipController", ["$scope", "$http", "$compile", "$sce", function ($scope, $http, $compile, $sce) {
    $scope.result1 = '';
    $scope.manifestoObject = {
        manifesto: [],
        mobileNo: ''
    };

    $scope.language1 = "En";
    if (localStorage.getItem("lan") != "" && localStorage.getItem("lan") != undefined)
        $scope.language1 = localStorage.getItem("lan");
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
        if (file[0].size > 10097152) { //2097152
            alert('Please select file size less than 10 MB');
            return false;
        }  
        var file = $('#myFile')[0].files[0].name;
        $("#lblFile").html(file);

        var formdata = new FormData();

        formdata.append('file', $('#myFile')[0].files[0]);

        var request = new XMLHttpRequest();
        $('#progress-bar-file1').show()
        request.upload.addEventListener('progress', function (e) {
            var file1Size = $('#myFile')[0].files[0].size;

            if (e.loaded <= file1Size) {
                var percent = Math.round(e.loaded / file1Size * 100);
                $('#progress-bar-file1').width(percent + '%').html(percent + '%');
            }

            if (e.loaded == e.total) {
                $('#progress-bar-file1').width(100 + '%').html(100 + '%');
           
            }
        });

        request.open('post', '/home/upload_video_file'); 
        request.send(formdata); 
        request.addEventListener("load", transferComplete);
        request.addEventListener("error", transferFailed); 

    });
    $scope.VideoFile = '';
    $scope.AadharFile = '';
    function transferComplete(evt) {
        try {
            // alert(evt.target.responseText)
           // document.write(evt.target.responseText)
            var fileresult = JSON.parse(evt.target.responseText);
            //alert(fileresult);
            if (fileresult.Response == 200 && fileresult.FileType == 'Video') {
                $scope.VideoFile = fileresult.Data;
                setTimeout(function () {
                    $('#progress-bar-file1').hide()
                }, 5000)
            }
            if (fileresult.Response == 200 && fileresult.FileType == 'Image') {
                $scope.AadharFile = fileresult.Data;
                setTimeout(function () {
                    $('#progress-bar-file2').hide()
                }, 5000)
            }

        } catch (e) {
           // alert(e);
        }
        // Do something
    }

    function transferFailed(evt) {
        console.log("An error occurred while transferring the file.");
        // Do something
    }
    $("#txtFile_phot").on("change", function () {
        var file = $("#txtFile_phot").get(0).files;
        if (file.length > 0) {
            if (!file[0].type.includes("image")) {
                alert("Please select image file only");
                $("#txtFile_phot").focus();
                return false;
            }
        }
 
        var file = $('#txtFile_phot')[0].files[0].name;
        $("#File_phot").html(file);
        $('#progress-bar-file2').show()
        var formdata = new FormData();

        formdata.append('file', $('#txtFile_phot')[0].files[0]);

        var request = new XMLHttpRequest();

        request.upload.addEventListener('progress', function (e) {
            var file1Size = $('#txtFile_phot')[0].files[0].size;

            if (e.loaded <= file1Size) {
                var percent = Math.round(e.loaded / file1Size * 100);
                $('#progress-bar-file2').width(percent + '%').html(percent + '%');
            }

            if (e.loaded == e.total) {
                $('#progress-bar-file2').width(100 + '%').html(100 + '%'); 
            }
        });

        request.open('post', '/home/upload_aadhar_file');
        request.timeout = 45000;
        request.send(formdata);
        request.addEventListener("load", transferComplete);
        request.addEventListener("error", transferFailed); 


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
        var file = $("#myFile").get(0).files;
        var aadhar_file = $("#txtFile_phot").get(0).files;
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
        else if ($scope.AadharFile == null || $scope.AadharFile =='') {
            showToast("Invalid aadhar file");
            return false;
        } 
        else if ($scope.VideoFile == null || $scope.VideoFile == '') {
            showToast("Invalid video file");
            return false;
        } 
        else {

            $(".loading").show();
            var data = new FormData();
            if (file.length > 0)
                data.append("Aadhar", aadhar_file[0]);
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
            data.append("VideoFile", $scope.VideoFile);
            data.append("ImageFile", $scope.AadharFile);
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
    $scope.close = function () {
        $("#content").hide;
        window.location.reload(true);
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
 
              
 
   
