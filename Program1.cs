using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace _10.泛型测试
{
    class Program
    {
        static void Main(string[] args)
        {
            object obj = null;
            bool isNull1 = obj == DBNull.Value;
            bool isNull2 = obj == null;



            List<BusinessValidationError<string>> businessValidationErrors = new List<BusinessValidationError<string>>()
            {
                new BusinessValidationError<string>("错误信息1","错误码1","BG9H"),

                new BusinessValidationError<string>("错误信息2","错误码2","BG9H"),

                new BusinessValidationError<string>("错误信息3","错误码3","BH97")
            };

            //Service层 错误信息
            BusinessValidationResult<string> businessValidationResult = new BusinessValidationResult<string>();
            businessValidationResult.AddErrorRange(businessValidationErrors);

            //Service层 业务错误信息：返回体
            var resultInfo = businessValidationResult.GetResultInfo();

            //正常返回体
            ResultInfo resultInfo1 = new ResultInfo();

            //Facade返回体
            List<FacadeResult<string>> facadeResults = new List<FacadeResult<string>>();
            foreach (var error in resultInfo.CustomObject.Errors)
            {
                FacadeResult<string> facadeResult = facadeResults.FirstOrDefault(f => f.CustomObject.Equals(error.CustomObject));

                if (facadeResult != null && !string.IsNullOrWhiteSpace(facadeResult.CustomObject))
                {
                    facadeResult.Errors.Add(new FacadeError() { ErrorCode = error.ErrorCode, ErrorMessage = error.ErrorMessage });
                }
                else
                {
                    facadeResult = new FacadeResult<string>()
                    {
                        CustomObject = error.CustomObject,
                        Errors = new List<FacadeError>() { new FacadeError() { ErrorCode = error.ErrorCode, ErrorMessage = error.ErrorMessage } }
                    };

                    facadeResults.Add(facadeResult);
                }
            }

            //var r = resultInfo.CustomObject.Errors.Select(error => new FacadeResult<string>
            //{
            //    CustomObject = error.CustomObject,
            //    Errors = new List<BusinessValidationError<string>>() { error }.Select(e => new FacadeError()
            //    {
            //        ErrorCode = e.ErrorCode,
            //        ErrorMessage = e.ErrorMessage
            //    }).ToList()
            //}).ToList();

            Console.ReadKey();
        }
    }

    public class FacadeError
    {
        /// <summary>错误代码</summary>
        public string ErrorCode { get; set; }

        /// <summary>错误消息</summary>
        public string ErrorMessage { get; set; }
    }

    public class FacadeResult<T>
    {
        /// <summary>自定义信息</summary>
        public T CustomObject { get; set; }

        public List<FacadeError> Errors { get; set; }
    }

    /// <summary>
    /// 异常错误实体
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class BusinessValidationError<T>
    {
        /// <summary>错误代码</summary>
        public string ErrorCode { get; set; }

        /// <summary>错误消息</summary>
        public string ErrorMessage { get; set; }

        /// <summary>自定义信息</summary>
        public T CustomObject { get; set; }

        public BusinessValidationError(string errorMessage = null, string errorCode = null, T customObject = default(T))
        {
            this.ErrorMessage = errorMessage ?? string.Empty;
            this.ErrorCode = errorCode ?? string.Empty;
            this.CustomObject = customObject;
        }
    }

    /// <summary>
    /// 业务验证结果
    /// </summary>
    public class BusinessValidationResult<T>
    {
        #region 构造器

        public BusinessValidationResult() : this(new List<BusinessValidationError<T>>()) { }

        public BusinessValidationResult(IEnumerable<BusinessValidationError<T>> errors)
        {
            this.Errors = (errors ?? new List<BusinessValidationError<T>>()).ToList();
        }

        public BusinessValidationResult(BusinessValidationError<T> error) : this(new List<BusinessValidationError<T>> { error }) { }

        //public BusinessValidationResult(string errorMessage) : this(new BusinessValidationError(errorMessage)) { }

        public BusinessValidationResult(string errorMessage, string errorCode = null, T customObject = default(T)) : this(new BusinessValidationError<T>(errorMessage, errorCode, customObject)) { }

        #endregion

        /// <summary>
        /// 自定义对象，通常用于关联错误相关的对象
        /// </summary>
        public T CustomObject { get; set; }

        public virtual bool IsValid
        {
            get
            {
                return this.Errors == null || this.Errors.Count < 1;
            }
        }

        public static BusinessValidationResult<T> SuccessfulResult
        {
            get
            {
                return new BusinessValidationResult<T> { Errors = new List<BusinessValidationError<T>>() };
            }
        }

        public IList<BusinessValidationError<T>> Errors { get; private set; }

        public BusinessValidationResult<T> AddErrorRange(IList<BusinessValidationError<T>> errors)
        {
            if (errors != null && errors.Count > 0)  
            {
                foreach (var error in errors)
                {
                    AddError(error);
                }
            }

            return this;
        }

        public virtual BusinessValidationResult<T> AddError(BusinessValidationError<T> error, bool isIgnoreRepeat = false)
        {
            if (error != null)
            {
                if (this.Errors == null)
                {
                    this.Errors = new List<BusinessValidationError<T>>();
                }

                if (!isIgnoreRepeat || !this.IsExistsErrorMessage(error?.ErrorMessage))
                {
                    this.Errors.Add(error);
                }
            }

            return this;
        }

        /// <summary>
        /// 根据验证情况抛出业务异常
        /// </summary>
        public void RaiseValidationError()
        {
            if (!this.IsValid)
            {
                throw this.GetBusinessException();
            }
        }

        /// <summary>
        /// 根据 Error 获取业务异常
        /// </summary>
        /// <returns></returns>
        public BusinessException GetBusinessException()
        {
            if (this.Errors == null || this.Errors.Count < 1)
            {
                return null;
            }
            if (this.Errors.Count == 1)
            {
                return new BusinessException(this.Errors[0].ErrorMessage, this.Errors[0].ErrorCode);
            }
            else
            {
                return new BusinessException(this.ToString());
            }
        }

        /// <summary>
        /// 是否已经存在某个错误消息
        /// </summary>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public bool IsExistsErrorMessage(string errorMessage)
        {
            if (this.Errors == null || this.Errors.Count < 1)
            {
                return false;
            }

            return this.Errors.Any(error => Convert.ToString(errorMessage).Equals(error.ErrorMessage));
        }

        /// <summary>
        /// 格式化错误信息
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            if (this.Errors == null || this.Errors.Count < 1)
            {
                return string.Empty;
            }
            return string.Join(";", this.Errors.Select(e => e.ErrorMessage).ToArray());
        }

        public ResultInfo<BusinessValidationResult<T>> GetResultInfo()
        {
            ResultInfo<BusinessValidationResult<T>> result = new ResultInfo<BusinessValidationResult<T>>();

            if (!this.IsValid)
            {
                result.IsSucceed = false;
                result.CustomObject = this;
            }

            return result;
        }
    }

    /// <summary>
    /// Service层返回实体
    /// </summary>
    public class ResultInfo: ResultInfo<object>
    {
    }

    /// <summary>
    /// Service层返回实体
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ResultInfo<T>
    {
        public ResultInfo() : this(null)
        {
            this.IsSucceed = true;
        }

        public ResultInfo(string message, string code = null, T customObject = default(T))
        {
            this.ResultMessage = message ?? string.Empty;
            this.ResultCode = code ?? string.Empty;
            this.CustomObject = customObject;
        }

        public string ResultCode { get; private set; }
        public string ResultMessage { get; private set; }

        public T CustomObject { get; set; }

        public bool IsSucceed { get; set; }
    }

    /// <summary>返回体-成功</summary>
    /// <remarks>
    /// 适合:某些API操作完成后仅仅只是需要告诉前端成功。<para></para>
    /// 这种情况下就适合使用此类
    /// </remarks>
    public class SuccessOut
    {
        public SuccessOut(string message = "Successfully", HttpStatusCode code = HttpStatusCode.OK)
        {
            this.Message = message;
            this.ResponseCode = (int)code;
            this.Time = DateTimeOffset.Now;
        }

        /// <summary>消息</summary>
        public string Message { get; }

        /// <summary>响应码，通常情况下是由Http状态码转换成string</summary>
        public int ResponseCode { get; }

        /// <summary>生成SuccessOut对象的时间</summary>
        public DateTimeOffset Time { get; }

        /// <summary>自定义对象</summary>
        public object CustomObject { get; set; }
    }

    /// <summary>业务异常</summary>
    public class BusinessException : ApplicationException
    {
        /// <summary>业务错误的代码</summary>
        public string ErrorCode { get; set; }

        /// <summary>HTTP状态码</summary>
        public HttpStatusCode StatusCode { get; set; }

        /// <summary>业务异常</summary>
        /// <param name="errorMessage">异常消息</param>
        /// <param name="errorCode">微服务中的业务异常代码</param>
        /// <param name="statusCode">http状态码，默认400</param>
        /// <param name="innerException">要包括的异常</param>
        public BusinessException(string errorMessage, string errorCode = "CM00000", HttpStatusCode statusCode = HttpStatusCode.BadRequest, Exception innerException = null)
            : base(errorMessage ?? errorCode, innerException)
        {
            this.ErrorCode = errorCode;
            this.StatusCode = statusCode;
        }
    }

    ///// <summary>
    ///// 转换类
    ///// </summary>
    //public static class MappingHelper
    //{
    //    public static string Convertor(this ResultInfo result)
    //    {
    //        if (result.IsSucceed)
    //        {
    //            return new SuccessOut();
    //        }
    //    }
    //}
}
