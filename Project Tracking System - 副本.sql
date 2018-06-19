

IF EXISTS (SELECT TOP 1 * FROM sysobjects WHERE NAME = 'MPS_Project_Tracking')
BEGIN
	DROP TABLE [dbo].[MPS_Project_Tracking]
END

CREATE TABLE [dbo].[MPS_Project_Tracking]
(
	ProjectId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Version] VARCHAR(16) NULL,
	[Status] VARCHAR(16) NOT NULL,
	Jira NVARCHAR(128) NOT NULL,
	ProjectDescription NVARCHAR(4000) NULL,
	BSD NVARCHAR(1024) NULL,
	LocalPM NVARCHAR(1024) NULL,
	Developer NVARCHAR(1024) NULL,
	Tester NVARCHAR(1024) NULL,
	StartDate Date NULL,
	TestDate Date NULL,
	ReleaseDate Date NULL,
	LaunchDate Date NULL,
	Memo NVARCHAR(4000) NULL,
	--以下为DBA要求字段
	InUserID INT NOT NULL,
	InUser VARCHAR(128) NULL,
	InDate DateTime NOT NULL DEFAULT(GetDate()),
	LastEditUserID INT NULL,
	LastEditUser VARCHAR(128) NULL,
	LastEditDate DateTime NULL
)




/****** Object:  StoredProcedure [dbo].[UP_MPS_ProjectTracking_GetProjectTracks]    Script Date: 2018/5/25 15:42:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[UP_MPS_ProjectTracking_GetProjectTracks]
	@Version VARCHAR(16),
	@Status VARCHAR(16),
	@Jira NVARCHAR(128),
	@StartDate DATETIME = NULL,
	@EndDate DATETIME = NULL,
	@StartTestDate DATETIME = NULL,
	@EndTestDate DATETIME = NULL,
	@StartReleaseDate DATETIME = NULL,
	@EndReleaseDate DATETIME = NULL,
	@StartLaunchDate DATETIME = NULL,
	@EndLaunchDate DATETIME = NULL,
	@KeyWords NVARCHAR(256),
	--翻页相关
	@PageIndex INT,
	@PageSize INT,
	@SortField NVARCHAR(256),
	@SortType NVARCHAR(256),
	@TotalCount INT OUT 
AS
BEGIN
	--条件判断
	IF(ISNULL(@SortField,'') = '') SET @SortField = 'InDate'
	IF(ISNULL(@SortType,'') = '') SET @SortType = 'Desc'
	IF(ISNULL(@PageIndex,0) = 0) SET @PageIndex = 1
	IF(ISNULL(@PageSize,0) = 0) SET @PageSize = 10
	--WHERE条件
	DECLARE @WhereSql NVARCHAR(4000) = N'1 = 1'
	IF(ISNULL(@Version,'') <> '')
	BEGIN
		SET @WhereSql += ' AND [Version] = '''+ @Version +''''
	END
	IF(ISNULL(@Status, '') <> '')
	BEGIN
		SET @WhereSql += ' AND [Status] = '''+ @Status +''''
	END
	IF(ISNULL(@Jira, '') <> '')
	BEGIN
		SET @WhereSql += ' AND [Jira] = '''+ @Jira +''''
	END
	IF(@StartDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [StartDate] >= '''+ CONVERT(NVARCHAR(24),@StartDate,101) +''''
	END
	IF(@EndDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [StartDate] <= '''+ CONVERT(NVARCHAR(24),@EndDate,101) +''''
	END
	IF(@StartTestDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [TestDate] >= '''+ CONVERT(NVARCHAR(24),@StartTestDate,101) +''''
	END
	IF(@EndTestDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [TestDate] <= '''+ CONVERT(NVARCHAR(24),@EndTestDate,101) +''''
	END
	IF(@StartReleaseDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [ReleaseDate] >= '''+ CONVERT(NVARCHAR(24),@StartReleaseDate,101) +''''
	END
	IF(@EndReleaseDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [ReleaseDate] <= '''+ CONVERT(NVARCHAR(24),@EndReleaseDate,101) +''''
	END
	IF(@StartLaunchDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [LaunchDate] >= '''+ CONVERT(NVARCHAR(24),@StartLaunchDate,101) +''''
	END
	IF(@EndLaunchDate IS NOT NULL)
	BEGIN
		SET @WhereSql += ' AND [LaunchDate] <= '''+ CONVERT(NVARCHAR(24),@EndLaunchDate,101) +''''
	END
	IF(ISNULL(@KeyWords,'') <> '')
	BEGIN 
		SET @WhereSql += ' AND ([Jira] LIKE ''%'+ @KeyWords +'%'' OR 
		[ProjectDescription] LIKE ''%'+ @KeyWords +'%'' OR
		[BSD] LIKE ''%'+ @KeyWords +'%'' OR
		[LocalPM] LIKE ''%'+ @KeyWords +'%'' OR
		[Developer] LIKE ''%'+ @KeyWords +'%'' OR
		[Tester] LIKE ''%'+ @KeyWords +'%''
		)'
	END

	--总条数
	DECLARE @SqlCount NVARCHAR(4000) = N'SELECT @TotalCount = COUNT(*) FROM [dbo].[MPS_Project_Tracking] WITH(NOLOCK) WHERE ' +  @WhereSql
	EXEC SP_EXECUTESQL @SqlCount,N'@TotalCount INT OUT',@TotalCount OUT

	--如果输入的当前页数大于实际总页数,则把实际总页数赋值给当前页数
	IF(@PageIndex > CEILING((@TotalCount + 0.0)/@PageSize))
	BEGIN
		SET @PageIndex = CEILING((@TotalCount + 0.0)/@PageSize)
	END

	DECLARE @QuerySql NVARCHAR(MAX) = N'SELECT TOP '+ LTRIM(STR(@PageSize)) + ' * FROM (
		SELECT ROW_NUMBER() OVER(ORDER BY ' + @SortField + ' ' + @SortType + ') AS ROWNUMBER,*
		FROM [dbo].[MPS_Project_Tracking] WITH(NOLOCK) WHERE ' + @WhereSql + '
	) T WHERE ROWNUMBER > '+ LTRIM(STR((@PageIndex - 1) * @PageSize)) + '';
	
	--PRINT(@QuerySql)
	EXEC SP_EXECUTESQL @QuerySql

END

