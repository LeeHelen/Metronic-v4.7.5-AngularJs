using System;
using Antlr4.StringTemplate;

namespace _25.StringTemplate测试
{
    class Program
    {
        static void Main(string[] args)
        {
            //UrlHostTemp();
            //SellerTemp();
            //SellerTemp1();
            //SellerTemp2();
            SellerTemp3();
        }

        #region 其他测试

        public static void UrlHostTemp()
        {
            const string hostTemplate = "Order #:<a href=\"$Host$/manage-order/orderlist?sellerID=BGGN&orderNumber=2222222&RFQNumber=122&p=workOnRFQ\" target=\"_blank\">2222222 #</a>";

            Template st = new Template(hostTemplate, '$', '$');

            st.Add("Host", "https://mps.newegg.org");

            st.Add("Host1", "https://mps.newegg.org");

            string str = st.Render();
        }

        public static void UrlSellerTemp()
        {
            Template e = new Template(
                "$[SellerIDs]:{SellerID|<a href=\"$Host$\" target=\"_blank\">$SellerID$</a>}; separator=\",\"$", '$', '$'
            );
            e.Add("SellerIDs", "Ter");
            e.Add("SellerIDs", "Tom");
            e.Add("Host", "https://mps.newegg.org");
            string result = e.Render();
        }

        public static void UrlSellerTemp1()
        {
            //string templates =
            //    "test(names,phones) ::= \"<foo([names,phones])>\"" + "\n" +
            //    "foo(items) ::= \"<items:{a | *<a>*}>\"" + "\n";

            //TemplateGroup templateGroup = new TemplateGroupString(templates);
            //TemplateGroup templateGroup = new TemplateGroupString("[string]", templates);

            string templates =
                "test(names,phones) ::= \"$foo([names,phones])$\"" + "\n" +
                "foo(items) ::= \"$items:{a | *$a$*}$\"" + "\n";
            TemplateGroup templateGroup = new TemplateGroupString("[string]", templates, '$', '$');

            Template e = templateGroup.GetInstanceOf("test");
            e.Add("names", "Ter");
            e.Add("names", "Tom");
            e.Add("phones", "1");
            e.Add("phones", "2");

            string result = e.Render();
        }

        public static void UrlSellerTemp2()
        {
            //string templates =
            //    "test(names,phones) ::= \"<foo([names,phones])>\"" + "\n" +
            //    "foo(items) ::= \"<items:{a | *<a>*}>\"" + "\n";

            //TemplateGroup templateGroup = new TemplateGroupString(templates);
            //TemplateGroup templateGroup = new TemplateGroupString("[string]", templates);

            string templates =
                "test(names) ::= \"$names:{a | *$a$*}$\"";
            TemplateGroup templateGroup = new TemplateGroupString("[string]", templates, '$', '$');

            Template e = templateGroup.GetInstanceOf("test");
            e.Add("names", "Ter");
            e.Add("names", "Tom");

            string result = e.Render();
        }

        public static void UrlSellerTemp3()
        {
            string templates = "SendRFQTemplate(SellerIds) ::= \"$SellerIds:{SellerId|<a href=\\\"\\\" target=\\\"_blank\\\">$SellerId$</a>}; separator=\\\",\\\"$\"";
            TemplateGroup templateGroup = new TemplateGroupString(string.Empty, templates, '$', '$');
            Template e = templateGroup.GetInstanceOf("SendRFQTemplate");
            e.Add("SellerIds", "BG9H");
            e.Add("SellerIds", "BHS9");

            string result = e.Render();
        }

        public static void methodTemp()
        {
            string templates = "FromatSeller(SellerIDs) ::= <a href=\"\" target=\"_blank\">$SellerIDs$</a>";

            TemplateGroup templateGroup = new TemplateGroupString("[string]", templates, '$', '$');

            Template st = templateGroup.GetInstanceOf("FromatSeller");
            st.Add("SellerIDs", "3");

            string result = st.Render();
        }

        public static void MethodTemp1()
        {
            TemplateGroup group = new TemplateGroup('$', '$');
            group.DefineTemplate("FromatSeller", "$SellerIDs:{SellerID | $SellerID$ }$", new string[] { "1", "2" });
            Template st = group.GetInstanceOf("FromatSeller");
            string result = st.Render();
        }

        #endregion

        public static void SellerTemp()
        {
            string templates = "SendRFQTemplate(SellerIds,Host) ::= \"$SellerIds:{SellerId|<a href=\\\"$Host$/Seller/About\\\" target=\\\"_blank\\\" title=\\\"测试\\\">$SellerId$</a>}; separator=\\\",\\\"$\"";
            TemplateGroup templateGroup = new TemplateGroupString("[string]", templates, '$', '$');
            Template e = templateGroup.GetInstanceOf("SendRFQTemplate");
            e.Add("Host","http://newegg.com");
            e.Add("SellerIds", "BG9H");
            e.Add("SellerIds", "BHS9");

            if (!e.impl.HasFormalArgs || (e.impl.HasFormalArgs && e.impl.TryGetFormalArgument("SellerIds1") != null))
            {
                e.Add("SellerIds1", "");
            }

            string result = e.Render();
        }

        public static void SellerTemp1()
        {
            TemplateGroup templateGroup = new TemplateGroup('$', '$');

            templateGroup.DefineTemplate("SendRFQTemplate", "$SellerIds:{SellerId | <a href=\"$Host$/Seller/About\" target=\"_blank\" title=\"测试\">$SellerId$</a>}; separator=\", \"$", new string[] { "SellerIds" });
            Template e = templateGroup.GetInstanceOf("SendRFQTemplate");
            e.Add("SellerIds", new int[] { 1, 2 });

            if (!e.impl.HasFormalArgs || (e.impl.HasFormalArgs && e.impl.TryGetFormalArgument("SellerIds1") != null))
            {
                e.Add("SellerIds1", "");
            }

            string result = e.Render();
        }

        public static void SellerTemp2()
        {
            Template e = new Template(
                "$SellerIDs:{SellerID|<a href=\"$Host$\" target=\"_blank\">$SellerID$</a>}; separator=\",\"$", '$', '$'
            );

            e.Add("SellerIDs", new int[] { 1, 2 });
            e.Add("SellerIDs11111", "Tom");
            e.Add("Host", "https://mps.newegg.org");
            string result = e.Render();
        }

        public static void SellerTemp3()
        {
            string newline = Environment.NewLine;

            string templates = "SendRFQTemplate(SellerIds,Host) ::= \"$SellerIds:{SellerId|<a href=\\\"$Host$/Seller/About\\\" target=\\\"_blank\\\" title=\\\"$GetSellerName(SellerId)$\\\">$SellerId$</a>}; separator=\\\",\\\"$\"";
            templates += newline + "OfflineOrderTemplate(OrderNumber) ::= \"Order #: $OrderNumber$\"";
            templates += newline + "GetSellerName(SellerName) ::= \"$SellerName$\"";

            TemplateGroup templateGroup = new TemplateGroupString("[string]", templates, '$', '$');

            //发送RFQ
            Template e = templateGroup.GetInstanceOf("SendRFQTemplate");
            e.Add("Host", "http://newegg.com");
            e.Add("SellerIds", "BG9H");
            e.Add("SellerIds", "BHS9");

            if (!e.impl.HasFormalArgs || (e.impl.HasFormalArgs && e.impl.TryGetFormalArgument("SellerIds1") != null))
            {
                e.Add("SellerIds1", "");
            }

            string result = e.Render();

            //离线订单
            e = templateGroup.GetInstanceOf("OfflineOrderTemplate");
            e.Add("OrderNumber", "1234567890");
            result += e.Render();
        }
    }
}



https://www.cnblogs.com/lwme/category/243746.html
https://blog.csdn.net/zhanglei5415/article/details/3611406?utm_source=blogxgwz1
https://blog.csdn.net/u011704663/article/details/79847229
