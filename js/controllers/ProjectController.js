angular.module('App', ["kendo.directives",'ui.bootstrap']).controller('ProjectController', ['$rootScope', '$scope', '$element', 'settings','$http', '$q', '$uibModal', function ($rootScope, $scope, $element, settings,$http, $q, $uibModal) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        //initialize datepicker
        $element.find('.date-picker').datepicker({
            format: 'mm/dd/yyyy',
            //orientation: "left",
            autoclose: true,
            clearBtn: true,
            enableOnReadonly: false,
            immediateUpdates: false,
            keepEmptyValues: true,
            todayBtn: true
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

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        // initialize Project data
        var model = $scope.model = {
            pageInfo: {
                PageIndex: 1,
                PageSize: 5,
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

        //Create
        $scope.Create = function () {
            $uibModal.open({  
                backdrop: false,
                backdropClass: 'modal-backdrop fade in',
                templateUrl : 'views/projectAdd.html',  
                controller : 'ProjectAddController',  
                resolve : {  
                //     data : function() { //data作为modal的controller传入的参数
                //         return data; //用于传递数据
                //    }
                }  
            });  
        };

        //Modify
        $scope.Modify = function () {
            
        };

        //Remove
        $scope.Remove = function () {
            var item = $scope.getItem();
            if (!item || item.length == 0 || !item.ProjectId) {
                bootbox.alert("Please select at least one Item."); 
                return;
            }
            bootbox.confirm("Are you sure to delete?", function(result) {
                if(result){
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
                        $scope.model.pageInfo.PageIndex = options.page;
                        $scope.model.pageInfo.PageSize = options.pageSize;
                        var requestPara = Object.assign($scope.model.requestPara, $scope.model.pageInfo);
                        return kendo.stringify(requestPara);
                    }
                },
                pageSize: $scope.model.pageInfo.PageSize,   //每页数据条数
                serverPaging: true,    //服务器提供分页
                serverSorting: true,   //服务器提供排序
                // group: {  //分组
                //     field: "FirstName",
                //     dir: "asc"
                // }
                schema: {
                    model: {
                        id: "FirstName",
                        fields: {
                            FirstName: { type: "string", editable: true, nullable: true },
                            LastName: { type: "string" },
                            Country: { type: "string" },
                            City: { type: "string" },
                            Title: { type: "string" }  //format: "{0:MM/dd/yyyy}"
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
                },
                { //表格列设置
                    field: "Version",
                    title: "Version",
                    width: "120px"
                }, {
                    field: "Status",
                    title: "Status",
                    width: "120px"
                }, {
                    field: "Jira",
                    width: "120px"
                }, {
                    field: "ProjectDescription",
                    width: "120px"
                }, {
                    field: "BSD",
                    width: "120px"
                }, {
                    field: "LocalPM",
                    width: "120px"
                }, {
                    field: "Developer",
                    width: "120px"
                }, {
                    field: "Tester",
                    width: "120px"
                }, {
                    field: "StartDate",
                    width: "120px"
                }, {
                    field: "TestDate",
                    width: "120px"
                }, {
                    field: "ReleaseDate",
                    width: "120px"
                }, {
                    field: "LaunchDate",
                    width: "120px"
                }, {
                    field: "Memo",
                    headerAttributes: {  //列标题居中
                        "class": "table-header-cell",
                        style: "text-align: center;font-weight: bold;"
                    },
                    attributes: { style: "text-align:center;" },  //列数据居左
                    //列数据过长时，不换行，简略为 " ... "
                    //attributes: {style: "white-space:nowrap;text-overflow:ellipsis;"},
                    width: "120px"
                }],
            editable: false  //是否可直接修改td
        };
    });
}]);


// {"Data":[{"ProjectId":12,"Version":"V18.2.002.4","Status":"0_Launched","Jira":"Jira","ProjectDescription":"ProjectDescription","BSD":"BSD","LocalPM":"LocalPM","Developer":"Developer","Tester":"Tester","StartDate":"\/Date(1528300800000+0800)\/","TestDate":"\/Date(1528300800000+0800)\/","ReleaseDate":"\/Date(1528300800000+0800)\/","LaunchDate":"\/Date(1528300800000+0800)\/","Memo":"Memo"},{"ProjectId":8,"Version":"V18.2.001.0","Status":"7_Hold","Jira":"MKTPO-4751","ProjectDescription":"Debit Balance Management Phase II -欠费过久了挂起商家账户","BSD":"Lee","LocalPM":"Tiger","Developer":"Malian","Tester":"Vivian","StartDate":"\/Date(1515513600000+0800)\/","TestDate":null,"ReleaseDate":"\/Date(1516723200000+0800)\/","LaunchDate":"\/Date(1517414400000+0800)\/","Memo":"修改备注"},{"ProjectId":7,"Version":"V18.2.002.3","Status":"6_WatingStart","Jira":"MKTPO-4318","ProjectDescription":"Approve Center Update for Subsidy III-Email Notification-Seller Payment & Sales Calculation-Seller Payment Report Update","BSD":"Howard","LocalPM":"Anglina","Developer":"Lewis\\Marlian","Tester":"","StartDate":"\/Date(1525017600000+0800)\/","TestDate":null,"ReleaseDate":null,"LaunchDate":null,"Memo":""},{"ProjectId":6,"Version":"V18.2.002.2","Status":"4_Coding","Jira":"MKTPO-4318","ProjectDescription":"Approve Center Update for Subsidy II -Edit/Advance Edit/View -b. 所有状态之间转换的Action: Edit / Advance Edit / View / Approve & Decline / Void / Close / Force Close / Seller Sign / Connect Promotion","BSD":"Howard","LocalPM":"Anglina","Developer":"Alisa Koji","Tester":"","StartDate":"\/Date(1522857600000+0800)\/","TestDate":null,"ReleaseDate":null,"LaunchDate":null,"Memo":""},{"ProjectId":5,"Version":"V18.2.002.1","Status":"2_Released","Jira":"MKTPO-4318","ProjectDescription":"Approve Center Update for Subsidy I-Search-Create","BSD":"Howard","LocalPM":"Anglina","Developer":"Alisa Koji","Tester":"","StartDate":"\/Date(1516032000000+0800)\/","TestDate":null,"ReleaseDate":"\/Date(1522857600000+0800)\/","LaunchDate":null,"Memo":""}],"TotalCount":9}