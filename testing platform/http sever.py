import socket
import datetime
from multiprocessing import Process
import re
import threading


class webserver:
    #### 在服务器上创建一个tcp型套接字并且绑定IP及端口等信息并且设置为监听模式，
    # 设置listen后 ，tcp_sock 就处于等待客户端连接的状态
    # 浏览器向服务器发出请求，这个请求将被tcp_sock接受到，并不是tcp_sock这个端口负责与浏览器通讯，
    # 重新创建一个socket并且分配一个随机的空闲端口负责与浏览器经行数据的收发
    def __init__(self,port,max_client):
        self.cnt = 0 # 记录连接数
        self.port = port # 端口
        self.max_client = max_client # 最大连接数
        self.Create_SeverSocket() # 创建服务器套接字
        
        
    def Create_SeverSocket(self):
        # 这里建立的是一个接受套接字，接受所有客户端的请求，并且创建一个新的套接字
        # windows套接字只支持一个通信区域即网际域（AF_INET）
        # stocket的类型有三类：流式套接字（SOCK_STREAM）和数据报式套接字（SOCK_DGRAM）和原始套接
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # 创建TCP套接字
        self.server_socket.bind(("",self.port)) # 绑定服务器端口，可以通过端口号指定
        self.server_socket.listen(self.max_client) # 监听，最大连接数为100
    
    
    ################ 客户端与服务器通信 ################
    # 说明： 对于多进程： 最后通信完毕后，关闭套接字，关闭进程，这样就不会占用资源
    #       对于多线程：通信完毕后不用关闭套接字，因为此时进程还在运行。
        
     # 创建客户向服务器通信，以及服务器的相应
    def Link1(self):
        # TCP套接字接受请求，创建一个新的针对客户端链接的套接字，把此请求传给新套接字去处理请求
        ##Wait for an incoming connection. Return a new socket representing the connection
        # accept是作用在服务器上的，接受客户端的connect
        client_socket, client_address = self.server_socket.accept() # 接收客户端连接
        self.cnt += 1
        print(f"连接数量：{self.cnt}")
        print(f"服务器套接字： {client_address[0]}:{client_address[1]}")
        # 创建进程，对服务器的TCP套接字发送请求，转交给新的进程去处理
        start_client_process = Process(target=self.client_server, args=(client_socket,client_address))
        start_client_process.start() # start是进程的方法，启动进程，目的是为了让进程在后台运行，不占用主进程的资源
        client_socket.close() # close是关闭连接，而不是关闭服务器
        
    def Link2(self):
        # TCP套接字接受请求，创建一个新的针对客户端链接的套接字，把此请求传给新套接字去处理请求
        ##Wait for an incoming connection. Return a new socket representing the connection
        client_socket, client_address = self.server_socket.accept() # 接收客户端连接
        self.cnt += 1
        print(f"连接数量：{self.cnt}")
        print(f"服务器套接字： {client_address[0]}:{client_address[1]}")
        # 每接受一个客户端连接，创建一个线程，为客户服务
        # 线程比进程更快，有更少的上下文切换开销，而且不需要像进程那样复制一份父进程的内存空间
        thread = threading.Thread(target=self.client_server,args=(client_socket,client_address))
        # 运行线程
        thread.start()
        
#     def Link3(self):
#             # 协程版启动
#             client_socket, client_address = self.server_socket.accept() # 接收客户端连接
#             self.cnt += 1
#             print(f"连接数量：{self.cnt}")
#             print(f"服务器套接字： {client_address[0]}:{client_address[1]}")

#             # 每接受到一个客户端连接，创建一个协程并运行，为客户服务
#             # 进程和线程都是操作系统之下的概念，而协程则是程序员自己设计的代码运行过程。
#             # 总结来说就一句话：对于并发执行的程序来讲，减少上下文切换的开销，提升程序的性能！
#             # 比线程更小地占用执行单元（自带CPU的上下文）
#             # 线程会造成缓存，使用协程直接操作CPU的上下文
#             # 首先协程算是用户态的线程，优势主要是少了内核态用户态的切换和能自己来做调度。
#             # 协程一般只在有IO操作的时候才能用到，对于一些会阻塞的IO操作，可以自己选择协程切换，等IO就绪了再切回来，可以更充分利用CPU。
#             # 就像你在做菜，切了萝卜去煲汤，另外还要煮鸡蛋：
# #1.线程的话，就是你切萝卜到一半就换成煮鸡蛋，然后一会换回来继续切萝卜（线程什么时候切换是操作系统决定的）
# #2.协程的话，就是你切完萝卜开始煲汤，然后自己换出去切煮鸡蛋（因为煲汤不用一直卡在那里嘛）
# # spawn的参数：
#             gevent.spawn(self.client_server, args=(client_socket,client_address))        
  
        
    # 客户端服务器
    def client_server(self,client_socket, client_addr):
        # 接收客户端发送的数据，1024是缓冲区大小，把接收到的请求数据存入request_data
        # 此时收到的数据是比特流GET请求
        # b'GET / HTTP/1.1\r\n ====》 从GET请求可以得到请求的文件路径GET /path HTTP/1.1\r\n，默认是\
        # Host: 127.0.0.1\r\n
        # Connection: keep-alive\r\n
        # Cache-Control: max-age=0\r\n
        # Upgrade-Insecure-Requests: 1\r\n
        # User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36\r\n
        # Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\n
        # Sec-Fetch-Site: none\r\n
        # Sec-Fetch-Mode: navigate\r\n
        # Sec-Fetch-User: ?1\r\n
        # Sec-Fetch-Dest: document\r\n
        # Accept-Encoding: gzip, deflate, br\r\n
        # Accept-Language: zh-CN,zh;q=0.9\r\n\r\n'
        request_data = client_socket.recv(4096)
        # 存储日志
        self.log(request_data) 
        
        # 解析请求数据，获取请求方式，请求路径，请求参数
        recv_str_data = request_data.decode()
        ## 首先按照换行符分割字符串，得到一个列表
        data_set = recv_str_data.split("\r\n")
        ## 然后从列表中取出第一个元素，里面包含请求方式和请求路径
        request_line = data_set[0]
        print(f"请求方式-路径信息-协议：{request_line}")
        ## 分割请求路径和请求参数
        result = re.match(r'.*? (?P<filePath>.*?) HTTP', request_line)
        if not result:
            print("HTTP请求报文格式错误")
            client_socket.close()
            return
        ## 根据正则结果对象取出文件路径
        path_info = result.group('filePath')
        print(f"接受到的用户的资源请求路径： {path_info}")

        # 默认路径，则使用主页面拼接
        if path_info == "/":
        # 用户请求/获取意味着 获取网站首页  web服务器通用规则
            path_info = '/系统/test/index.html'
        try:
            print("浏览器请求的资源地址： " + path_info)
            print("文件打开尝试")
            # rb是二进制读取，网站首页是二进制文件
            file = open(path_info, 'rb')
            print("文件打开：", file)
            file_data = file.read()
            file.close()
        except Exception as e:
            # 响应行
            response_line = "HTTP/1.1 404 Not Found\r\n"
            # 响应头
            response_header = "Server: PythonWebServer 5.0\r\n"
            response_body = "ERROR: file not found!!!"
            response_data = response_line + response_header+"\r\n"+response_body
            # encode()方法将字符串转换为字节码
            client_socket.send(response_data.encode())
        else:
            # 响应行
            response_line = "HTTP/1.1 200 OK\r\n"
            # 响应头
            response_header = "Server: PythonWebServer 5.0\r\n"
            # 响应体-服务器存储给浏览器发送的资源文件数据
            response_body = file_data
            # 拼接HTTP响应报文数据
            response_data = (response_line+response_header+"\r\n").encode() + response_body
            client_socket.send(response_data)
        finally:
            # 关闭套接字
            client_socket.close()


    def log(self, data):
        now_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open("log.txt",'a+') as f:
            f.write("\n%s\n%s" %(now_time, data))

if __name__ == '__main__':    
    res = webserver(8088,100)
    while True:
        res.Link2()
    
    
    
    
