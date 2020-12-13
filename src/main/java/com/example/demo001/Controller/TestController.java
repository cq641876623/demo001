package com.example.demo001.Controller;

import com.example.demo001.entity.Result;
import com.example.demo001.entity.User;
import com.example.demo001.websocket.WebSocketServer;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Controller
@RequestMapping
public class TestController {

    @RequestMapping("/wedding")
    public String google()  {
        return "wedding";
    }

    @RequestMapping("/google")
    @ResponseBody
    public byte[] google(@RequestParam String url) throws IOException {
        OkHttpClient okHttpClient=new OkHttpClient().newBuilder().build();
        Request request=new Request.Builder().url("http://"+url).build();
        Response response = okHttpClient.newCall(request).execute();
        return response.body().bytes();
    }

    @RequestMapping("/chat")
    public String chatRoom(@CookieValue(value = "userid",required = false) String userid,HttpServletRequest request, HttpServletResponse response) throws IOException {
        if(userid==null){
            userid=UUID.randomUUID().toString();
            Cookie cookie = new Cookie("userid", userid);
            response.addCookie(cookie);
        }
        return "chatRoom";
    }

    @RequestMapping("/userList")
    @ResponseBody
    public List<User> getUserList(@CookieValue(value = "userid",required = false)String userid){
        List<User> userLis=new ArrayList<>();
        for(String userId:WebSocketServer.webSocketMap.keySet()){
            User user=new User();
            user.setId(userId);
            user.setName(userId);
            user.setImg("dist/images/2.png");
            userLis.add(user);
        }
        userLis=userLis.stream().filter(new Predicate<User>() {
            @Override
            public boolean test(User user) {
                return !user.getId().equals(userid);
            }
        }).collect(Collectors.toList());
    return userLis;
    }



    @PostMapping("/pdfChangeWord")
    public void pdfChangeWord(@RequestParam("file") MultipartFile multipartFile,HttpServletResponse response){
        try {
            String outName;
            if(multipartFile.getOriginalFilename().endsWith(".pdf")){
                outName=URLEncoder.encode(multipartFile.getOriginalFilename().substring(0,multipartFile.getOriginalFilename().length()-4), "UTF-8");
            }else {
                outName= URLEncoder.encode("temp", "UTF-8");;
            }
            OutputStream out=response.getOutputStream();
            InputStream in=multipartFile.getInputStream();
            PDDocument doc = null;
            Writer writer = null;
            PDFTextStripper stripper = null;
            doc = PDDocument.load(in);
            writer = new OutputStreamWriter(out, "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename="+ outName+".doc");
            response.addHeader("Content-Type","application/msword;chartset=uft-8");
            stripper = new PDFTextStripper();
            int pageNumber = doc.getNumberOfPages();
            stripper.setSortByPosition(true);
            stripper.setStartPage(1);
            stripper.setEndPage(pageNumber);
            stripper.writeText(doc, writer);
            writer.close();
            doc.close();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
