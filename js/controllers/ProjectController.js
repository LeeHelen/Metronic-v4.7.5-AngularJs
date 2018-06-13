angular.module('App', ["kendo.directives"]).controller('ProjectController', ['$rootScope', '$scope', '$element', 'settings', function ($rootScope, $scope, $element, settings) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

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
            }
        };

        //Create
        $scope.Create = function () {
            alert("x");
        };

        //Modify
        $scope.Modify = function () {
            alert("x");
        };

        //Remove
        $scope.Remove = function () {
                        
        };
    });

    //initialize Table data
    $scope.projectGridOptions = {
        //$element.find("#projectGrid")
        dataSource: {
            type: "odata",
            transport: {
                read: { 
                    url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Employees",
                    //dataType: "json"
                }
            },
            pageSize: 5,
            serverPaging: true,
            serverSorting: true,
            // group: {  //分组
            //     field: "FirstName",
            //     dir: "asc"
            // }
        },
        selectable: "multiple row",
        sortable: true, //是否排序
        pageable: true, 
        dataBound: function() {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        pageable: {   //分页信息选项设置  
            input: true,
            numeric: true,
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        }, 
        // toolbar: [ //工具条，可使用模板自定义  
        //     {
        //         name: "create",
        //         text: "添加"
        //     }
        // ],
        columns: [
            { 
                title: " <input id='checkAll' type='checkbox' id='chkSelectAll' onclick='selectAllRow(this)' /> ", 
                template: "<input type='checkbox' onclick='selectRow()' class='grid_checkbox' />", 
                width: 60, 
                filterable: false, 
                sortable: false },{ //表格列设置
            field: "FirstName",
            title: "First Name",
            width: "120px"
            },{
            field: "LastName",
            title: "Last Name",
            width: "120px"
            },{
            field: "Country",
            width: "120px"
            },{
            field: "City",
            width: "120px"
            },{
            field: "Title"
        }]
    };
}]);
