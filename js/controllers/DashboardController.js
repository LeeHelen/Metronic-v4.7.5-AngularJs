angular.module('App').controller('DashboardController', ['$rootScope', '$scope', '$http', '$timeout', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        //init
        var model = $scope.entity = {
            statistics: {
                totalProjects: 0,
                totalLaunchedProjects: 0,
                totalParticipants: 0,
                totalTimes: 0,
                statisticsType : 1
            },
            statisticsCharts: {
                totalProjects: 0,
                totalCodingProjects: 0,
                totalReleasedProjects: 0,
                totalLaunchedProjects: 0
            },
            statisticType : 1
        }

        //get statistics data  
        $scope.getStatistics = function () {
            $http({
                method: 'POST',
                url: 'http://localhost:52151/project/statistic',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            }).then(function successCallback(response) {
                // 请求成功执行代码
                if(response && response.data) {
                    model.statistics.totalProjects = response.data.TotalProjects || 0;
                    model.statistics.totalLaunchedProjects = response.data.TotalLaunchedProjects || 0;
                    model.statistics.totalParticipants = response.data.TotalParticipants || 0;
                    model.statistics.totalTimes = response.data.TotalTimes || 0;
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
            });
        };
        $scope.getStatistics();

        //get statistics charts data
        $scope.getStatisticsCharts = function () {
            $http({
                method: 'POST',
                url: 'http://localhost:52151/project/statisticcharts',
                headers: {
                    //"Content-Type": "application/x-www-form-urlencoded",
                    "Content-Type": "application/json;charset=utf-8",
                    "Accept": "application/json"
                },
                //data: $.param({ StatisticType : 1 })
                data: { StatisticType : model.statisticType }
            }).then(function successCallback(response) {
                // 请求成功执行代码
                if(response && response.data) {
                    if(response.data.TotalDescribe) {  
                        var totalDescribe = response.data.TotalDescribe;
                        model.statisticsCharts.totalProjects = totalDescribe.TotalProjects || 0;
                        model.statisticsCharts.totalCodingProjects = totalDescribe.TotalCodingProjects || 0;
                        model.statisticsCharts.totalReleasedProjects = totalDescribe.TotalReleasedProjects || 0;
                        model.statisticsCharts.totalLaunchedProjects = totalDescribe.TotalLaunchedProjects || 0;
                    }
                    if(response.data.Data) {
                        $scope.initMorisCharts(response.data.Data)
                    }
                }
                // $scope.initMorisCharts();
            }, function errorCallback(response) {
                // 请求失败执行代码
            });
        }
        $scope.getStatisticsCharts();

        //init MorisCharts
        $scope.initMorisCharts = function (data) {
            if (Morris.EventEmitter && $('#project_statistics_chart').size() > 0) {
                $("#project_statistics_chart").empty();
                // Use Morris.Area instead of Morris.Line
                dashboardMainChart = Morris.Area({
                    element: 'project_statistics_chart',
                    padding: 0,
                    behaveLikeLine: false,
                    gridEnabled: false,
                    gridLineColor: false,
                    axes: false,
                    fillOpacity: 1,
                    data: data,
                    lineColors: ['#399a8c', '#92e9dc'],
                    xkey: 'date',
                    ykeys: ['total'],
                    labels: ['Total'],
                    pointSize: 0,
                    lineWidth: 0,
                    hideHover: 'auto',
                    resize: true
                });
            }
        }
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);

