// (function(){
    
// })()

angular.module('App', ["kendo.directives", 'ui.bootstrap',"oc.lazyLoad"])
.controller('appModalInstanceCtrl', ['$scope','$uibModalInstance','modalDatas','$http',function ($scope,$uibModalInstance,modalDatas,$http) {
    var $ctrl = this;
    $scope.modalDatas = modalDatas; //双向绑定，方便在确认中回传可能修改的字段
   
    // $ctrl.insta
    $ctrl.ok = function (val) {

        if (!$("#form_project_add").valid()) {
            return;
         }
        $scope.submitForm($scope.model.entity, function (results) {
            if (results.ResponseCode == '200') {
                messager.success("The project has been created successfully!");
                $ctrl.cancel();
            }
        });
    //   $scope.modalDatas.result = val;
    //   $uibModalInstance.close(
    //     $scope.modalDatas  //在模态框View中修改的值传递回去，view中可以直接添加属性
    //   );
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
    if(modalDatas && modalDatas.actionType == "Modify") {
        model.entity = modalDatas.entity;
    }
    else{
        model = $scope.model = {
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
    }

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
                icon.attr("data-original-title", error.text()).tooltip({'placement' : 'right'});
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
                //$scope.submitForm();
            }
        });
    };

    $scope.submitForm = function(data, callback) {
        $http.post("http://localhost:52151/project/Create", data)
        .success(function (results) {
            callback(results);
        });
    };

  }])
.controller('ProjectController', ['$rootScope', '$scope', '$element', 'settings', '$http', '$q', '$uibModal', function ($rootScope, $scope, $element, settings, $http, $q, $uibModal) {
    // debugger;
    // $scope.$on('$viewContentLoaded', function () {
    //     // initialize core components
    //     App.initAjax();

    //     // set default layout mode
    //     $rootScope.settings.layout.pageContentWhite = true;
    //     $rootScope.settings.layout.pageBodySolid = false;
    //     $rootScope.settings.layout.pageSidebarClosed = false;
    // });

    //initialize datepicker
    $element.find('.date-picker').datepicker({
        format: 'mm/dd/yyyy',
        //orientation: "left",
        autoclose: true,
        clearBtn: true,
        enableOnReadonly: false,
        immediateUpdates: false,
        keepEmptyValues: true,
        todayBtn: 'linked'
    }).on("changeDate", function (e) {
        // console.log(e.date);
        // console.log(e.target.id);
        if (e && e.target && e.target.id && e.target.id) {
            switch (e.target.id) {
                case "StartDate":
                    $scope.model.requestPara.StartDate = e.date;
                    break;
                case "EndDate":
                    $scope.model.requestPara.EndDate = e.date;
                    break;
                case "StartTestDate":
                    $scope.model.requestPara.StartTestDate = e.date;
                    break;
                case "EndTestDate":
                    $scope.model.requestPara.EndTestDate = e.date;
                    break;
                case "StartReleaseDate":
                    $scope.model.requestPara.StartReleaseDate = e.date;
                    break;
                case "EndReleaseDate":
                    $scope.model.requestPara.EndReleaseDate = e.date;
                    break;
                case "StartLaunchDate":
                    $scope.model.requestPara.StartLaunchDate = e.date;
                    break;
                case "EndLaunchDate":
                    $scope.model.requestPara.EndLaunchDate = e.date;
                    break;
            }
        }
        $scope.$apply();
    });

    // initialize Project data
    var model = $scope.model = {
        pageInfo: {
            PageIndex: 1,
            PageSize: 10,
            SortField: "InDate",
            SortType: "DESC"
        },
        requestPara: {
            Version: "",
            Status: "",
            Jira: "",
            StartDate: null,
            EndDate: null,
            StartTestDate: null,
            EndTestDate: null,
            StartReleaseDate: null,
            EndReleaseDate: null,
            StartLaunchDate: null,
            EndLaunchDate: null,
            KeyWords: ""
        },
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

    var httpLoad = function (method, url, queryPara, urlPara) {
        var deferred = $q.defer(),
            paras = queryPara;
        if (method === 'get' || urlPara) paras = {
            params: queryPara
        };
        $http[method](url, paras || null)
            .success(function (result) {
                deferred.resolve(result)
            })
            .error(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    //Search
    $scope.Search = function () {
        var requestPara = Object.assign(model.requestPara, model.pageInfo);
        $element.find("#projectGrid").data("kendoGrid").dataSource.read(kendo.stringify(requestPara));
    };

    $scope.openModel = function () {
        //type即view文件名，在同一个页面有多个不同业务的模态框的情况下很方便
        var tplUrl = 'views/confirm.html';
        $scope.modalDatas = {
            msg: 'Hello World!'
        };
  
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: tplUrl,
          controller: 'appModalInstanceCtrl',
          controllerAs: '$ctrl',
          resolve: {
            modalDatas: function () {
                return $scope.model;
            }
          }
        });
        modalInstance.rendered.then(function () {
            //初始化
        });


        // modalInstance.result.then(function (datas) {
        //   // 点击确认按钮执行的代码
        //   //可以从datas中获取msg和content字段
        //   //进一步操作：发起http请求等      
        //   alert("x"); 
        // }, function () {
        //   // 点击取消按钮执行的代码
        //   console.info('Modal dismissed at: ' + new Date());
        // });
      };

    //Create
    $scope.Create = function () {
        $scope.model.actionType = "Create";
        $scope.openModel();
        
        // // debugger;
        // var modalInstance = $uibModal.open({
        //     backdrop: 'static', //（类型：boolean|string，默认值：true） -控制的背景下存在。允许值：（true默认），false（无背景），’static’（通过点击背景禁用模态关闭）。
        //     //backdropClass: 'modal-backdrop fade in kyle', //附加CSS类（ES）被添加到一个模态的背景模板。
        //     templateUrl: 'views/projectAdd.html',
        //     controller: function ($scope, $uibModalInstance) { 
        //         // $scope.ok = function () {
        //         //     $uibModalInstance.close($scope.selected);
        //         // };
        //         $scope.cancel = function () {
        //             $uibModalInstance.dismiss('cancel');
        //         };
        //     },
        //     //controller: 'ProjectController',
        //     resolve: {
        //         //     data : function() { //data作为modal的controller传入的参数
        //         //         return data; //用于传递数据
        //         //    }
        //     }
        // });
        // modalInstance.result.then(function (datas) {
        //     // 点击确认按钮执行的代码
        //     //可以从datas中获取msg和content字段
        //     //进一步操作：发起http请求等       
        //   }, function () {
        //     // 点击取消按钮执行的代码
        //     console.info('Modal dismissed at: ' + new Date());
        //   });
    };

    $scope.toString = function (value, format) {
        if (!!value) {
            var fmtString = format || "MM/dd/yyyy HH:mm tt";
            try {
                return kendo.toString(new Date(value), fmtString);
            }
            catch (err) {
                return "";
            }
        } else {
            return "";
        }
    };

    //Modify
    $scope.Modify = function () {
        var item = $scope.getItem();
        if (!item || item.length == 0 || !item.ProjectId) {
            bootbox.alert("Please select at least one Item.");
            return;
        }
        //格式化时间
        item.StartDate = $scope.toString(item.StartDate, "MM/dd/yyyy");
        item.TestDate= $scope.toString(item.TestDate, "MM/dd/yyyy");
        item.ReleaseDate= $scope.toString(item.ReleaseDate, "MM/dd/yyyy");
        item.LaunchDate= $scope.toString(item.LaunchDate, "MM/dd/yyyy");

        $scope.model.actionType = "Modify";
        $scope.model.entity = item;

        $scope.openModel();
    };

    //Remove
    $scope.Remove = function () {
        var item = $scope.getItem();
        if (!item || item.length == 0 || !item.ProjectId) {
            bootbox.alert("Please select at least one Item.");
            return;
        }
        bootbox.confirm("Are you sure to delete?", function (result) {
            if (result) {
                var results = httpLoad('get', 'http://localhost:52151/project/delete/' + item.ProjectId);
                if (results.ResponseCode == '200') {
                    messager.success("The project has been remove successfully!");
                    $scope.Search();
                }
            }
        });
    };

    //Get the Selected Grid Rows Data
    $scope.getItem = function () {
        var grid = $("#projectGrid").data("kendoGrid"); //grid对象
        var row = grid.select(); //获取选中行对象  
        var dataItem = grid.dataItem(row); //获取选中行元素数据 
        return dataItem;
    };

    //initialize Table data
    $scope.projectGridOptions = {
        //$element.find("#projectGrid")
        dataSource: { //数据源
            type: "odata",
            transport: {
                read: {
                    url: "http://localhost:52151/project/simplifyquery",
                    contentType: "application/json",
                    dataType: "json",
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    if(options) {
                        $scope.model.pageInfo.PageIndex = options.page || $scope.model.pageInfo.PageIndex;
                        $scope.model.pageInfo.PageSize = options.pageSize || $scope.model.pageInfo.PageSize;
                        if(options.sort && options.sort.length > 0) {
                            $scope.model.pageInfo.SortField = options.sort[0].field || $scope.model.pageInfo.SortField;
                            $scope.model.pageInfo.SortType = options.sort[0].dir || $scope.model.pageInfo.SortType;
                        }
                        console.log(options);
                    }
                    var requestPara = Object.assign($scope.model.requestPara, $scope.model.pageInfo);
                    return kendo.stringify(requestPara);
                }
            },
            pageSize: $scope.model.pageInfo.PageSize,   //每页数据条数
            serverPaging: true,    //服务器提供分页
            serverSorting: true,   //服务器提供排序
            // group: {  //分组
            //     field: "Version",   
            //     dir: "asc"
            // },
            schema: {
                model: {
                    id: "FirstName",
                    fields: {
                        FirstName: { type: "string", editable: true, nullable: true },
                        LastName: { type: "string" },
                        Country: { type: "string" },
                        City: { type: "string" },
                        Title: { type: "string" },   
                        StartDate:  { type: "date" },   //format: "{0:MM/dd/yyyy}"
                        TestDate:  { type: "date" },
                        ReleaseDate:  { type: "date" },
                        LaunchDate:  { type: "date" }
                    }
                },
                data: function (response) {
                    return response.Data;
                },
                total: function (response) {
                    return response.TotalCount;
                }
            }
        },
        scrollable: true, //允许滚动条
        persistSelection: true, //允许选择
        // selectable: "multiple, row",  //row:行,cell:项,multiple, row:多行,multiple, cell:多项
        navigatable: false, //选择td是否有背景色
        //groupable: true,  //是否分组
        sortable: true, //是否排序
        sortable: { //排序风格
            mode: "single",
            allowUnsort: false
        },
        reorderable: true,  //重新排序表头
        resizable: true,  //重新改变宽度
        allowCopy: true, //当他设置true，用户就可以选中行点击复制，可以复制进入excel和记事本。
        dataBound: function () { //数据加载后执行的事件 
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        // excel: {                     //excel
        //     allPages: true         //设置导出所有页面，默认导出excel的当前页面
        // },
        //pageable: true, 
        pageable: {   //分页信息选项设置  
            input: true,
            numeric: true,
            refresh: true,
            pageSizes: true,
            buttonCount: 5,
            alwaysVisible: false,
            pageSizes: [10, 30, 100]
        },
        // toolbar: [ //工具条，可使用模板自定义  
        //     // {
        //     //     name: "create",
        //     //     text: "添加"
        //     // },
        //     kendo.template($element.find("#toolbarTemplate").html()),           //工具栏
        // ],
        //toolbar: ["create", "save", "cancel"],
        // toolbar:kendo.template($element.find("#toolbarTemplate").html()),  
        columns: [
            // { 
            //     title: " <input id='checkAll' type='checkbox' id='chkSelectAll' onclick='selectAllRow(this)' /> ", 
            //     template: "<input type='checkbox' onclick='selectRow()' class='grid_checkbox' />", 
            //     width: 60, 
            //     filterable: false, 
            //     sortable: false },
            {
                field: "ProjectId",
                selectable: true, width: "30px", headerAttributes: {  //列标题居中
                    //"class": "table-header-cell",
                    //style: "text-align: center;vertical-align: middle;padding:0;"
                },
                attributes: {
                    //style: "text-align:center;"
                },  //列数据居左
                sortable: false,
                hidden: false,       //是否隐藏列  
            },
            { //表格列设置
                field: "Version",
                title: "Version",
                width: "100px",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
            }, {
                field: "Status",
                title: "Status",
                width: "115px",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
            }, {
                field: "Jira",
                width: "110px",
                template: "<a href='http://jira.newegg.org/browse/#: Jira #' target='_blank'>#: Jira #</a>",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
            }, {
                field: "ProjectDescription",
                title: "ProjectDescription",
                width: '500px',
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                },
                attributes: {style: "white-space:nowrap;text-overflow:ellipsis;"},  
                sortable: false,
                template: "<div style='white-space:nowrap;text-overflow:ellipsis;width:35em;-o-text-overflow:ellipsis; overflow:hidden;' title='{{dataItem.ProjectDescription}}'>{{dataItem.ProjectDescription}}</div>",
            }, {
                field: "BSD",
                width: 120,
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                },  
                sortable: false
            }, {
                field: "LocalPM",
                width: "120px",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                },  
                sortable: false
            }, {
                field: "Developer",
                width: "120px",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                },  
                sortable: false
            }, {
                field: "Tester",
                width: "120px",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                },  
                sortable: false
            }, {
                field: "StartDate",
                width: "120px",
                template: "#=  (StartDate == null)? '' : kendo.toString(kendo.parseDate(StartDate, 'yyyy-MM-dd'), 'MM/dd/yy') #",
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
                //format: "{0: MM/dd/yyyy}"  
            }, {
                field: "TestDate",  
                width: "120px",
                format: "{0: MM/dd/yyyy}" ,
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
            }, {
                field: "ReleaseDate",
                width: "120px",
                format: "{0: MM/dd/yyyy}" ,
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
            }, {
                field: "LaunchDate",
                width: "120px",
                format: "{0: MM/dd/yyyy}" ,
                headerAttributes: {  //列标题居中
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                }
            }, {
                field: "Memo",
                headerAttributes: {  //列标题居中
                    //"class": "table-header-cell",
                    style: "text-align: center;font-weight: bold;vertical-align: middle;"
                },
                // attributes: { style: "text-align:center;" },  //列数据居左
                //列数据过长时，不换行，简略为 " ... "
                //attributes: {style: "white-space:nowrap;text-overflow:ellipsis;"},
                width: "200px",  
                sortable: false,
                template: "<div style='width:13em; white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;' title='{{dataItem.Memo}}'>{{dataItem.Memo}}</div>",
            }],
        editable: false  //是否可直接修改td
    };
}]);

// {"Data":[{"ProjectId":12,"Version":"V18.2.002.4","Status":"0_Launched","Jira":"Jira","ProjectDescription":"ProjectDescription","BSD":"BSD","LocalPM":"LocalPM","Developer":"Developer","Tester":"Tester","StartDate":"\/Date(1528300800000+0800)\/","TestDate":"\/Date(1528300800000+0800)\/","ReleaseDate":"\/Date(1528300800000+0800)\/","LaunchDate":"\/Date(1528300800000+0800)\/","Memo":"Memo"},{"ProjectId":8,"Version":"V18.2.001.0","Status":"7_Hold","Jira":"MKTPO-4751","ProjectDescription":"Debit Balance Management Phase II -欠费过久了挂起商家账户","BSD":"Lee","LocalPM":"Tiger","Developer":"Malian","Tester":"Vivian","StartDate":"\/Date(1515513600000+0800)\/","TestDate":null,"ReleaseDate":"\/Date(1516723200000+0800)\/","LaunchDate":"\/Date(1517414400000+0800)\/","Memo":"修改备注"},{"ProjectId":7,"Version":"V18.2.002.3","Status":"6_WatingStart","Jira":"MKTPO-4318","ProjectDescription":"Approve Center Update for Subsidy III-Email Notification-Seller Payment & Sales Calculation-Seller Payment Report Update","BSD":"Howard","LocalPM":"Anglina","Developer":"Lewis\\Marlian","Tester":"","StartDate":"\/Date(1525017600000+0800)\/","TestDate":null,"ReleaseDate":null,"LaunchDate":null,"Memo":""},{"ProjectId":6,"Version":"V18.2.002.2","Status":"4_Coding","Jira":"MKTPO-4318","ProjectDescription":"Approve Center Update for Subsidy II -Edit/Advance Edit/View -b. 所有状态之间转换的Action: Edit / Advance Edit / View / Approve & Decline / Void / Close / Force Close / Seller Sign / Connect Promotion","BSD":"Howard","LocalPM":"Anglina","Developer":"Alisa Koji","Tester":"","StartDate":"\/Date(1522857600000+0800)\/","TestDate":null,"ReleaseDate":null,"LaunchDate":null,"Memo":""},{"ProjectId":5,"Version":"V18.2.002.1","Status":"2_Released","Jira":"MKTPO-4318","ProjectDescription":"Approve Center Update for Subsidy I-Search-Create","BSD":"Howard","LocalPM":"Anglina","Developer":"Alisa Koji","Tester":"","StartDate":"\/Date(1516032000000+0800)\/","TestDate":null,"ReleaseDate":"\/Date(1522857600000+0800)\/","LaunchDate":null,"Memo":""}],"TotalCount":9}