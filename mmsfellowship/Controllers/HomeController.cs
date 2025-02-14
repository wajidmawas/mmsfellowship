using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Web;
using System.Web.Mvc;
using static Antlr.Runtime.Tree.TreeWizard;
using static System.Net.Mime.MediaTypeNames;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices.ComTypes;
using System.Runtime.Remoting.Lifetime;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web.Services.Description;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.WebControls;

namespace mmsfellowship.Controllers
{
    public delegate void ASyncMethodCaller(string Name, string EmailId);
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
           // SendNotif("Hafeez", "hafeez.24@gmail.com");
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        public void SendNotif(string Name, string EmailId)
        {
            string strBody = @"Dear "+ Name.ToUpper() + @", 
Thank you for your interest in the Dr.Manmohan Singh Fellows Program by the All India Professionals’ Congress.We are thrilled to see your passion for public service and leadership, and we appreciate your commitment to shaping a brighter future for India.

Next Steps

Your application has been received successfully.As part of the selection process, here’s what to expect:

1️. Application Review – Our team will assess your submission based on the eligibility criteria and your demonstrated passion for societal change.

2️. Video Submission – If you haven’t already, please record and submit a 3-minute video introducing yourself and your vision for India’s future and email to mmsfellows@profcongress.in

3️. Personal Interview – Shortlisted candidates will be invited for an interaction with our selection committee to discuss their ideas and aspirations further.

We appreciate your enthusiasm and the time you have taken to apply. Should you have any questions or require any assistance, feel free to reach out at mmsfellows@profcongress.in

Stay tuned for updates on your application status!

Best regards,
Dr.Manmohan Singh Fellows Program Team
All India Professionals’ Congress";
            var client = new SmtpClient("smtpout.secureserver.net", 587)
            {
                Credentials = new NetworkCredential("mmsfellow@profcongress.in", "Delhi@987"),
                EnableSsl = true,

            };

            try
            {
                client.Send("mmsfellow@profcongress.in", EmailId, "Thank You for Applying – Dr. Manmohan Singh Fellows Program", strBody);
            }
            catch (Exception ex)
            {
                  
            }
        }
        public void CallBack(IAsyncResult res)
        {

        }
        [HttpPost]
        public ActionResult Savemmsfellowship()
        {
            try
            {

                var httpPostedFile = HttpContext.Request.Files.Count > 0 ? HttpContext.Request.Files[0] : null;

                if (!Directory.Exists(AppDomain.CurrentDomain.BaseDirectory + ("~/Profiles/")))
                {
                    Directory.CreateDirectory(AppDomain.CurrentDomain.BaseDirectory + ("Profiles/"));
                }
                string filnm = Guid.NewGuid().ToString();
                string videofilnm = Guid.NewGuid().ToString();
                if (HttpContext.Request.Files.Count > 0)
                {
                    httpPostedFile = HttpContext.Request.Files["Aadhar"];
                    string extension = System.IO.Path.GetExtension(httpPostedFile.FileName);
                    filnm = filnm + extension;
                    string filePath = AppDomain.CurrentDomain.BaseDirectory + ("Profiles/") + "\\" + filnm;
                    httpPostedFile.SaveAs(filePath);

                    httpPostedFile = HttpContext.Request.Files["file"];
                      extension = System.IO.Path.GetExtension(httpPostedFile.FileName);
                    filnm = filnm + extension;
                      filePath = AppDomain.CurrentDomain.BaseDirectory + ("Profiles/") + "\\" + filnm;
                    httpPostedFile.SaveAs(filePath);
                }
                else
                    filnm = "";
                ArrayList obj = new ArrayList();
                obj.Add(HttpContext.Request.Form["Name"]);
                obj.Add((HttpContext.Request.Form["DOB"]));
                obj.Add(HttpContext.Request.Form["Gender"]);
                obj.Add((HttpContext.Request.Form["MobileNo"]));
                obj.Add((HttpContext.Request.Form["EmailAddress"]));
                obj.Add((HttpContext.Request.Form["StateID"]));
                obj.Add((HttpContext.Request.Form["Qualification"]));
                obj.Add((HttpContext.Request.Form["District"]));
                obj.Add((HttpContext.Request.Form["IPAddress"]));
                obj.Add(System.Configuration.ConfigurationManager.AppSettings["ApiUrl"].ToString() + "Profiles/" + filnm);
                obj.Add(System.Configuration.ConfigurationManager.AppSettings["ApiUrl"].ToString() + "Profiles/" + videofilnm);
                Common.InfoLogs("Comments Request Object before saving USP_APP_SAVEMMSFELLOWSHIP: " + JsonConvert.SerializeObject(obj));
                DataSet dset = ServiceActionHelper.ExecuteSP(obj, "USP_APP_SAVEMMSFELLOWSHIP");
                if (dset != null && dset.Tables.Count > 0 && dset.Tables[0].Rows.Count > 0)
                {
                    ASyncMethodCaller caller = new ASyncMethodCaller(this.SendNotif);
                    caller.BeginInvoke(HttpContext.Request.Form["Name"], HttpContext.Request.Form["EmailAddress"], new AsyncCallback(this.CallBack), caller);

                    return Json(new { Response = 200, Data = JsonConvert.SerializeObject(dset), JsonRequestBehavior.AllowGet });
                }
                else
                    return Json(new { Response = -100, Data = "Error Occured Please try again later", JsonRequestBehavior.AllowGet });

            }
            catch (Exception ex)
            {
                Common.InfoLogs("Comments Request Object Exception saving USP_APP_SAVEMMSFELLOWSHIP: " + ex.Message);

                return Json(new { Response = -100, Data = ex.Message, JsonRequestBehavior.AllowGet });
            }
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        [Route("apply")]
        public ActionResult registration()
        {
            ViewBag.Message = "";

            return View();
        }
    }
}