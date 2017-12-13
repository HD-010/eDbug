<?php
/**
 * @author w
 * 使用说明：
 * 1、在项目的入口文件添加 .htaccess文件，内容如下：
 * RewriteEngine on
 * # if a directory or a file exists,use the request directly
 * RewriteCond %{REQUEST_FILENAME} !-f
 * RewriteCond %{REQUEST_FILENAME} !-d
 * # Otherwise forward the request to index.php
 * DirectoryIndex debug.php
 * 2、将当前文件放在入口文件所在的目录
 * 3、设置有读文件路径和写文件路径，以便调试使用。
 * 4、如果读文件路径没有设置，则用写文件路径作为读文件的路径。写文件路径必须设置
 */

class EDebug{
    public $checkFile = 'index_t.php';              //配置入口文件
    public static $logPath;                         //配置写日志文件路径
    public static $addInfo = [];                    //附加信息
    public static $basePath = __DIR__;
    public static $readOnly = '';                  //真为只读
    public $writePath = '/elog.html';
    public $readPath = '';      //配置读日志文件路径
    public $baseUri = 'http://js.e01.com';

    function __construct(){
        global $oper;
        //处理传入的参数
        $this->processData();     
        $main = ucfirst($oper);      
        if(method_exists($this,'get'.$main)){
            $this->{'get'.$main}();
        }
    }
    
    //处理传入的参数
    public function processData(){
        //从$_REQUSEA中获取参数的名称
        $keys = array_keys($_REQUEST);
        extract($_REQUEST);
        for($i = 0; $i < count($keys); $i ++){
            $keyName = $keys[$i];
            $GLOBALS[$keys[$i]] = $$keyName;
        }
    }

    //查看日志
    public function getLayout(){
        $content = file_get_contents('./view/eBug.htm');
        $content = str_replace("\r", '', $content);
        $content = str_replace("\n", '', $content);
        echo "var bodyContents ='". $content."'";
    }
    
    public function getEbug(){
        $contents = file_get_contents('./static/js/eBug.js');
        echo $contents;
    }
    
    public function getEBugStyle(){
        $contents = file_get_contents('./static/js/eBugStyle.js');
        echo $contents;
        
    }
    
    //解析日志类型
    public function getParseFormate(){
        //$data = htmlspecialchars($data);
        header("Access-Control-Allow-Origin:*"); 
        $strHtml = $this->logFormate();
        echo $strHtml;
    }
    
    //格式化json代码
    public function getCodeFormate(){
        global $data;
        header("Access-Control-Allow-Origin:*");
        $data = json_decode($data);
        $strHtml = $this->eachElement($data);
        echo $strHtml;
    }
    
    //获取格式化后的代码列表
    public function getCodeList(){
        header("Access-Control-Allow-Origin:*");
        $strHtml = $this->eachElement();
        echo $strHtml;
    }
    
    //调试服务端功能扩展
    public function getFunc(){
        global $data;
        $code = [];
        $code['clear'] = 'file_put_contents($fileName,"");echo 5';
        header("Access-Control-Allow-Origin:*");
        echo htmlspecialchars($code[$data]);
    }
    
    //格式化日志为html代码
    public function logFormate(){
        global $data;
        $lines = explode('`p`', $data);
        $contents = "";
        //遍历数组整理数据
        foreach($lines as $line){
            $line = trim($line);
            $strStart = substr($line,0,1);
            $strEnd = substr($line,-1);
            if(($strStart == '{' && $strEnd== '}') ||
                ($strStart == '[' && $strEnd == ']')){
                    $contents .= "<div><span name='ft' onclick=logObj.formateCode(this)>格式化代码</span><span name='code'>" . $line . "</span></div>\r\n";
            }else{
                $contents .= "<p>".$line."</p>\r\n";
            }
        }
        
        return $contents;
    }
    
    //格式化json代码
    public function eachElement($data) {
        $str = "";
        if (is_object($data)) {
            $str .= "{";
            foreach ($data as $k => $v) {
                $str .= "<span name=st>";
                if (!is_object($v) && !is_array($v)) {
                    $str .= "<font source=object>" . $k . " : ". $v . "</font>";
                } else {
                    $str .= "<font source=object>" . $k . ":" . $this->eachElement($v) . "</font>";
                }
                $str .= "</span>";
            }
            $str .= "}";
        } else if (is_array($data)) {
            $str .= "[";
            foreach ($data as $k => $v) {
                $str .= "<span name=st>";
                if (!is_object($v) && !is_array($v)) {
                    $str .= "<font source=array>" . $v	. "</font>";
                } else {
                    $str .= "<font source=array>" . $this->eachElement($v)	. "</font>";
                }
                $str .= "</span>";
            }
            $str .= "]";
        }
        return $str;
    }
}
new EDebug();