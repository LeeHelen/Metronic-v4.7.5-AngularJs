using Antlr4.StringTemplate;
using System;

namespace _4.StringTemplate4测试
{
    class Program
    {
        //https://www.cnblogs.com/lwme/category/243746.html

        //[TestMethod]
        //[TestCategory(TestCategories.ST4)]
        //public void TestSeparatorInPrimitiveArray()
        //{
        //    TemplateGroup group = new TemplateGroup();
        //    group.DefineTemplate("test", "<names:{n | case <n>}; separator=\", \">", new string[] { "names" });
        //    Template st = group.GetInstanceOf("test");
        //    st.Add("names", new int[] { 0, 1 });
        //    string expected =
        //        "case 0, case 1";
        //    string result = st.Render();
        //    Assert.AreEqual(expected, result);
        //}

        static void Main(string[] args)
        {
            //string templates = "$FromatSeller(SellerIDs)$ FromatSeller(SellerIDs) ::= { SellerIDs; wrap=\"\\n\", separator=\",\" };";

            //TemplateGroup templateGroup = new TemplateGroupString("[string]", templates, '$', '$');

            //Template st = templateGroup.GetInstanceOf("FromatSeller");
            //st.Add("SellerIDs", new string[]{ "1","2" });

            //string result = st.Render();


            //Template e = new Template(
            //    "<[SellerID]; separator=\",\">"
            //);

            //e.Add("SellerID", "Ter");
            //e.Add("SellerID", "Tom");

            //string str = e.Render();

            //UrlHostTemp();
            //UrlSellerTemp();
            //UrlSellerTemp1();
            //UrlSellerTemp2();
            UrlSellerTemp3();
            //methodTemp();
            //MethodTemp1();
        }


        public static void UrlHostTemp()
        {
            const string hostTemplate = "Order #:<a href=\"$Host$/manage-order/orderlist?sellerID=BGGN&orderNumber=2222222&RFQNumber=122&p=workOnRFQ\" target=\"_blank\">2222222 #</a>";

            Template st = new Template(hostTemplate, '$', '$');

            st.Add("Host", "https://mps.newegg.org");

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
    }

    public static class RFQProcessLogProcessTemplate
    {
        public const string Send_RFQ_To_Seller = "{SellerID}";

        public const string Seller_Submit_Quotation = "{SellerID}, Quantity: {Quantity} Unit Price: ${UnitPrice}, Shipping Method: {ShipMethod}, Shipping Option: {ShippingChargeType} - ${ShippingCharge}</br>Total Amount: ${TotalAmount}";

        public const string Seller_Decline_Quotaion = "{SellerID}, Memo: {UserInputMemo}";

        public const string Confirm_Seller_Offer = "{SellerID}, Quantity: {Quantity} Unit Price: ${UnitPrice}, Shipping Method: {ShipMethod}, Shipping Option: {ShippingChargeType} - ${ShippingCharge}</br>Total Amount: ${TotalAmount}";

        public const string Manual_Close_RFQ = "";

        public const string Auto_Close_RFQ = "Closed by system automatically after offline order is placed";

        public const string Expire_RFQ = "Expired by system automatically after Expired Date is due, and no any seller quotation is confirmed.";

        public const string Create_Order = "Order #: {OrderNumber}";
    }
}
