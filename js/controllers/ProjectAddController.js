/* Setup blank page controller */
angular.module('App', ['ui.bootstrap'])
.controller('ProjectAddController', ['$rootScope', '$scope', 'settings', '$element', '$uibModalInstance', function($rootScope, $scope, settings, $element, $uibModalInstance) {
    // $scope.$on('$viewContentLoaded', function() {   
    //     // initialize core components
    //     App.initAjax();

    //     // set default layout mode
    //     $rootScope.settings.layout.pageContentWhite = true;
    //     $rootScope.settings.layout.pageBodySolid = false;
    //     $rootScope.settings.layout.pageSidebarClosed = false;

    // });

    var $ctrl = this;
    $scope.modalDatas = modalDatas; //双向绑定，方便在确认中回传可能修改的字段
   
    // $ctrl.insta
    $ctrl.ok = function (val) {
      $scope.modalDatas.result = val;
      $uibModalInstance.close(
        $scope.modalDatas  //在模态框View中修改的值传递回去，view中可以直接添加属性
      );
    };
    
    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    var model = $scope.model = {
        actionType: '',
        entity: {
            ProjectId: 0,
            Version: "",
            Status: "",
            Jira: "",
            ProjectDescription: "",
            BSD: "",
            LocalPM: "",
            Developer: "",
            Tester: "",
            StartDate: null,
            TestDate: null,
            ReleaseDate: null,
            LaunchDate: null,
            Memo: ""
        }
    };

    //initialize datepicker
    $element.find('.date-picker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        clearBtn: true,
        todayBtn: 'linked'
    });

    $scope.initForm = function(){
        var form = $('#form_project_add');
        var errorAlert = $('.alert-danger', form);
        var successAlert = $('.alert-success', form);
        form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",  // validate all fields including form hidden input
            rules: {
                Version: {
                    minlength: 10,
                    required: true
                },
                Status: {
                    required: true
                },
                Jira: {
                    required: true
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit              
                successAlert.hide();
                errorAlert.show();
                App.scrollTo(errorAlert, -200);
            },
            errorPlacement: function (error, element) { // render error placement for each input type
                var icon = $(element).parent('.input-icon').children('i');
                icon.removeClass('fa-check').addClass("fa-warning");  
                icon.attr("data-original-title", error.text()).tooltip({'container': 'body'});
            },
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group   
            },
            unhighlight: function (element) { // revert the change done by hightlight
            },
            success: function (label, element) {
                var icon = $(element).parent('.input-icon').children('i');
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                icon.removeClass("fa-warning").addClass("fa-check");
            },
            submitHandler: function (form) {
                successAlert.show();
                errorAlert.hide();
                //form[0].submit(); // submit the form
                $scope.submitForm();
            }
        });
    };

    $scope.submitForm = function() {
        $http.post("http://localhost:52151/project/Create1", $scope.model.entity)
        .success(function (results) {
            if (results.ResponseCode == '200') {
                alert("The project has been created successfully!");
            }
        });
    };

}]);
