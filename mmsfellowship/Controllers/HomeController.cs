using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace mmsfellowship.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
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
                    return Json(new { Response = 200, Data = JsonConvert.SerializeObject(dset), JsonRequestBehavior.AllowGet });
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