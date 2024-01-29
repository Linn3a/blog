---
title: summary for os 💻
subtitle: 终于考完，一份简单的操作系统总结。
date: 2023-12-28 12:00:00
tags: [dev,专业课,操作系统, summary]
series: 3
cover: /blog/images/os.png
---

> [!abstract] abstract
>
> OS总结，主要基于谢老师的PPT
> 
>


# 操作系统 🐧

## 进程

### 进程与线程

- 进程模型

  - 5-state
    - ![img](/blog/images/os_state1.png)
  - 增加挂起态 被移动到辅存的进程
    - ![img](/blog/images/os_state2.png)
  - 进程描述符/进程控制块 pcb
    - 组合起来叫 进程表
    - 包含
      - 进程标识信息
        - PID，UID
      - 处理器状态信息
        - 寄存器（用户可见，pc，条件码，status info（是否允许中断，mode）） 栈指针
      - 进程控制信息
        - 状态 mode
  - 进程控制 
    - 模式 用户态/内核态
      - 切换方法
        - 系统调用
        - 异常或中断
    - 创建进程 fork `pid=0`的是主进程
    - 切换进程
      - 一定是kernel获得控制权的时候才可能发生切换 模式切换是进程切换的前提
      - 切换过程 
        - 保存程序上下文和pc
        - 更新原进程的pcb 从running变成ready或者blocked
        - 把原pcb放到对应的队列
        - 选择新的进程
        - 更新pcb
        - 更新管理内存的数据结构：mmu、页表、cache
        - 根据新进程保存的上下文恢复上下文
    - 进程通信
      - 共享的内存空间
      - message

- 线程

  - 概念

    - 多个线程共享内存空间，有自己的pc和寄存器，栈

  - 多线程模型

    - user-level
      - 由线程库实现创建、销毁、消息传递、调度执行、保存恢复上下文
      - 当讨论线程状态和进程状态的关系时，有一点特别的
        - 可能进程block了 但是线程仍然是ready 因为线程直接切内核态，没有时间运行用户语句修改进程状态
      - 缺点 
        - 线程系统调用后 必须切换进程 不能只切换线程
        - 内存共享 如果一个线程页表fault 其他的也不能用
        - 多线程应用不能利用多进程

    - kernel-level
      - s-kernel 维护两张表 process table，thread table 真正的并发
      - 但是 线程切换也经过内核态 会很浪费时间
    - ult和klt的对应关系 一对多 多对一 多对多 都可以
      - 多对多模型
        - lwp lightweight process 一个kernel thread绑定（attach on）一个lwp 对于ult，lwp相当于一个虚拟processor，绑定若干个ult
        - 进程池 节约创建和销毁的时间
        - 调度和激活：upcall
          - 当一个ult要阻塞的时候，kernel发出一个upcall
          - upcall handler是属于thread library的！！
            - 保存ult上下文 回收lwp
            - 分配一个其他的ready线程（ult）
            - 阻塞结束，kernel发出一个新的upcall通知线程库

### 并发

- 互斥

  - 软件实现（互斥算法）

    - Dekker
      - 1：全局变量turn turn=0 -> P0，做完了改成1; turn = 1 -> P1，做完了改成0
        - 缺点
          - 自旋忙等
          - 严格交替，但是访问临界区的频率可能不同，造成浪费
          - 一个死了，两个都完蛋
      - 2：一人一个变量在或不在 ==不能互斥==，写和读flag可能同时
      - 3：先修改，再测试 此时的含义变成了想进 ==可以互斥 但是可能两个进程都等待，造成死锁==
      - 4：互相谦恭，为了避免两个人都想进都等待，发现别人想进的时候，等一会，再想进，没有死锁，有活锁
      - final：交替谦让 
        - turn=1 1谦让，不等于1的时候再想进，做完之后turn=1，flag[0]=0
        - turn=0 2谦让，不等于0的时候想进，做完之后turn=0，flag[1]=0 
    - Peterson
      - 如果想进，两个人都去修改turn的值，谁的速度快，就该谁使用临界区
      - 可能饿死，因为可能一直抢不到

  - 硬件实现

    - 关中断

      - 只能针对单处理器
        - 关闭系统中断，保证访问临界区的时候没有系统调用，这样没有进程切换，没有内核态，有且仅有当前程序 
        - 不好，给用户太多权限，如果死循环，操作系统就永远拿不会控制权

    - 机器指令

      - test and set（TSL）

        - 只有原来是0，现在改成1了，这个值才是1

        - 只有把一把原本打开的锁关闭的时候，才能进入临界区

          ```c
          while(true) {
              while(!testset(bolt)) 
              // critical section
              bolt = 0;    
          }
          ```

      - exchange instruction XCHG

        - 相同的，拿1去换，看换出来的是不是0

      - 两个指令的缺点

        - 忙等 消耗cpu时钟，不建议在单处理器上使用
        - 可能造成死锁 高优先级等待低优先级 优先级倒置

- 信号量 Semaphore

  - 实现
    - 1个整型值 初始化为非负
    - wait 递减 若小于0 阻塞 为0的时候不阻塞，刚刚吃完
    - signal 递增 若小于等于0 就唤醒一个队列中的进程 
      - 因为是递增后等于0 说明此时队列里还是有东西的
    - 二元信号量
      - 值为1 供给正常
      - 值为0 要阻塞了
  
  - 示例
  
    - 生产者消费者
  
      - 生产者 
        - 等待篮子
        - 唤醒饼
      - 消费者
        - 等待饼
        - 唤醒篮子
      - 注意 对临界区保护的锁只能在最里面 这个次序是重要的 否则可能死锁
      - 用二元信号量实现 ⭐
        - 实现不一样 因为一开始是没有产品的 一开始消费者需要wait
        - 进入循环之后，n一定是大于0的，只有n==0 的时候需要wait 
        - 此时的n是一个非负的值
        - 对于临界区变量n的判别也应该放在互斥区内，但是这样会导致消费也在互斥区内，会影响效率
          - 解决：用局部变量承接n的值
  
    - 理发店问题
  
      - ![img](/blog/images/os_barber.png)
  
      - 关键的问题是要拿到当前处理的客户的编号，finish要和对应客户对应 做法是用一个长度为3的公共队列表示chair，客户入队，理发师出队
  
        ```c
        // define Semaphore
        semaphore capacity = 20;
        semaphore sofa = 4;
        semaphore chair = 3;
        semaphore cashier = 1;
        semaphore customer_ready = 0;
        semaphore finish = 0;
        semaphore barber_avalible = 3;
        
        // a mutex lock
        semaphore mutex = 1;
        // count 也要锁！ 因为可能有好几个客户
        count = 0;
        semaphore countLock = 1;
        
        void customer() {
            int number = 0;
            wait(capacity);
            
            enter_shop();
            wait(countLock);
            count ++;
            number = count;
        	signal(countLock);
            
            wait(sofa);
            
            sit_on_sofa();
            
            wait(chair);
            
            leave_sofa();
            signal(sofa);
            
            sit_on_chair();
            wait(mutex);
            enqueue(number);
            signal(mutex);
            
            signal(customer_ready);
            hair_cut();
            wait(finish[number]);
            
            leave_chair();
            signal(chair);
            
            pay();   
            signal(to_pay);
            wait(receipt);
            
            leave_shop();
            signal(capacity);
        }
        
        void barber() {
            // barber
            while(true) {
                int number = 0;
                wait(customer_ready);
                wait(mutex);
                dequeue(number);
                signal(mutex)
            	wait(barber_avalible);
            	cut_hair();
        		
            	// 有问题 finish应该和客户对应起来
            	signal(finish[number]);
            
            	signal(barber_avalible);
            }
        }
        void cashier() {
            while(true) {
                wait(to_pay);
                wait(barber_avalible);
                receipt();
                signal(receipt);
                signal(barber_avalible);
            }
        }
        ```
  
    - 读者写者 ⭐
  
      - 读者可以并发 写要互斥
  
        - 一个信号量表示读者占有临界区，当读者为0时，释放
  
        - 问题 写进程可能死锁
  
        - 改进 写优先的读写锁
  
          - 设立一个信号量告诉现在写者来了，后面的读者先排队，不要进来了，这样可以防止饿死
            - 一开始 若没有写者锁，第一个读者抢占wsem，大家直接尽力啊
            - 出现写者锁之后，大家都要在外面排队
            - 对写者，第一个写者抢占写者锁，没有写者的时候释放写者锁，每一个写者都要等待读者锁。
  
          ```c
          // important semaphore
          semaphore reader_has = 1;
          semaphore writer_has = 1;
          int readercount = 0;
          int writercount = 0;
          
          void reader() {
              while(true) {
                  wait(writer_has);
                  wait(lock1);
                  readercount++;
                  
                  if(readercount == 1) {
                      wait(reader_has);
                  }
                  signal(lock1);
                  READ();
                  signal(writer_has);
                  
                  wait(lock1);
                  readercount--;
                  if(readercount == 0) {
                      signal(reader_has);
                  }
                  signal(lock1);
              }
          }
          
          
          void writer() {
              while(true) {
                  wait(lock2);
          		writercount ++;
                  if(writercount == 1) {
                      wait(writer_has);
                  }
                  signal(lock2);
                  wait(reader_has);
                  WRITE();
                  signal(reader_has);
                  
                  wait(lock2);
                  writercount--;
                  if(writercount == 0) {
                      signal(writer_has);
                  }
                  signal(lock2);
              }
          }
          ```
        
      - 一个问题是 对于一个信号量来说，他的signal和wait应该是一一对应的，因为会涉及到递减和递加
  
    - 过桥
  
      - 一个单行车道 三辆车并行
      - 相当于两群写者
    
  - 管程
  
    - 任何时刻任何管程中只有一个进程
  
  - 条件变量
  
    - 只有两个操作 `cwait` 阻塞当前进程 和`csignal`唤醒
      - `csignal`时，会阻塞到当前进程，因为要唤醒别的进程，此时的进程进入==urgent==状态
      - 当然 如果此时队列空 就什么也不做
    - 可用两对初始值为0的信号量实现
  
- 死锁

  - 死锁的必要条件

    - 互斥
    - 占有且等待
    - 非抢占
    - 出现循环等待

  - 资源分配图

    - 进程指向资源表示请求
    - 资源指向进程表示拥有
    - cycle和死锁
      - 如果图上无环 一定没有死锁
      - 如果有环 **可能**有死锁

  - 事前预防

    - 破坏必要条件
      - hold and wait
        - 规定只有手里没有临界资源时可以请求

      - 不可抢占
        - 如果一个进程没有没有开始（在等待），那他的资源是可以被抢占的（保存并释放

      - 循环等待
        - 给所有资源排序，请求的资源号码必须大于占有的资源

  - 事中动态决策

    - 定义符号

      - $Resource = (R_1,R_2,...,R_m)$

        $Available=(V_1,V_2,...V_m)$

        两个矩阵 一个进程的总需求量，一个进程的分配量

    - 进程启动拒绝

      - 对每一个资源 所有进程声明的资源总量要小于资源总量R，否则拒绝启动

    - 资源分配拒绝 银行家算法

      - 定义 安全状态 可以找到一个次序，使得所有进程都安全结束
      - 算法 使系统始终处于安全状态 
        - 假设接收 看是不是处于安全状态
        - 不是就拒绝

      - 是一种保守的做法，非安全状态不代表一定出现死锁

  - 事后检测

    - 死锁检测算法 请求矩阵Q
      - 标记所有A全0的进程
      - W=Available
      - 找一行未标记的，请求Q <= W 
      - 找到了，标记，说明这个进程可以完美结束，结束后把分配的Ai加到W上，继续找
      - 直到找不到为止，剩下的都死锁

    - 恢复
      - 人工 询问操作员
      - 自动 终止某个进程/抢占资源
      - 鸵鸟算法 假装没有死锁

  - 哲学家就餐问题

    - 预防
      - 从循环等待入手 
        - 请求的叉子编号要大于已有的叉子


### 调度

- 长程调度
  - 在新进程创建的时候，是否放到ready队列中
- 中程调度
  - 什么时候挂起
- 短程调度
  - 从ready队列里选下一个进程
  - 进程
    - Processor-bounded processes 计算时间长
    - I/O-bounded processes I/O时间长
    - 衡量指标
      - 周转时间 Turnaround Time
        - 等待时间+服务时间 
      - 归一化周转时间 Normalized Turnaround Time
        - 周转时间/服务时间
  - 短程调度算法 ⭐
    - ![image-20231224174850238](/blog/images/image-20231224174850238.png)
    - 先来先服务 FIFO/FCFS
      - 对长进程效果更好
    - 轮转调度 是抢占式的（在分片末尾抢占）
      - 轮转调度 Round-Robin
        - time slicing 到了一定时间就切换进程
        - 对I/O-bounded process不太公平 有的进程因为被io阻塞，时间片没用完，恢复之后排到最尾部
      - 虚拟轮转调度 virtual round robin
        - 增加了一个 FCFS anxiliary queue
        - 从阻塞态解除的进程放到这个队列 优先级高于ready队列
    - 剩余时间
      - ==非抢占== Shortest Process Next 耗时最短的进程优先 SPN
        - 下一个进程是cpu burst最短的进程
        - 缺点 长进程可能饿死
      - ==抢占式== Shortest Remaining Time 最短剩余时间
        - 记录当前运行进程的剩余时间，新来的进程比较自己的和当前运行进程的剩余时间，如果自己的少，就抢占
        - 队列里面的也是先运行剩余时间少的
    - 优先级调度 Priority Scheduling
      - 进程分配一个优先级 可以实现上面的各个算法 并且优先级是动态调度的,可以防止无限制的运行, 也可以防止饿死
      - 最高响应比优先 Highest Response Ratio Next ==非抢占式==
        - 选择R最大的进程 $R=\frac{w+s}{s}$ w等待了的时间，s服务时间
        - 隐式实现了短进程优先，并且考虑了等待时间，避免饿死
      - 多层队列调度 Multilevel Queue Scheduling 
        - 惩罚已经运行了很久的进程
        - 一次分一个时间片 如果发现不够 下次轮到你的时候就分多一点 两倍或者1.5倍
        - 时间片多的进程优先级会低 每个队列之间采用FCFS
    - 公平调度 fair-share scheduling
      - 按用户组分配资源
    - ![img](/blog/images/os_sche.png)

## 内存 

### 内存分配

- 连续内存分配

  - fixed partition

    - 固定大小 有内部碎片 没有外部碎片
    - 放置算法
      - 放到可以容纳下的最小分区 
        - 一个分区有一个中程调度队列 如果不空就进队列等着
      - 最小的可用分区
        - 所有分区一个队列

  - dynamic partition

    - 外部碎片
      - 解决 compaction 紧凑化 把进程挪到一起 非常耗时
    - 实现 链表
    - 放置算法
      - best fit 不好
      - first fit 最好的最快的
      - next fit 不如first 总是倾向在底部  
      - worst 最大的 也不好 分解了
      - first > next > best
    - 回收空间后分区数可能增加，可能减少，可能不变

  - buddy system

    - 大于空间的一半就给整块，小于一般就分裂 
    - 互为buddy的两块都空的时候可以合并
    - 二叉树

  - relocation

    - fixed 且一个分区一个队列 那么一个程序的位置永远不会变化 可用用物理空间

    - 其他情况 动态装载 dynamic run-time loader

    - 保留基地址和边界地址

      - MMU从base register取值 得到absolute address

        bound register的作用是：保护！要比较得到的绝对地址 是否小于等于bound 不满足就内部中断

- 非连续内存分配

  - 分页
    - 内存上说页 物理上说帧
    - 没有外部碎片 内部碎片只在最后一个页面 期望是半个页面
    - page number + offset 用page number查页表 得到frame number，`[frame number, offset]`即为物理地址
    - 可以实现独立和保护，通过共享页还可以传递信息
  - 分段
    - 对程序员透明 把一个程序分成大小不同的各个段，可能是一个函数一个段
    - 没有内部碎片，有外部碎片
    - 地址转换
      - 逻辑地址 段名+offset
      - 表项 [段名，start address，length，保护位] 用段名查表，得到地址
      - 比较offset和length 
      - `start_address+offset`
    - 段的动态增长
      - 可以只变长度
      - heap向下 stack向上 可能撞车
    - 便于动态链接，保护，共享
  - 混合管理方法
    - 段页式 [段号，页号，页内offset]
    - 段表表项 段号，页表位置
    - 容易实现共享，段表表项指向同一个页表

### 虚拟内存

- 设计原则
  - thrashing 抖动/颠簸
    - 缓存不好 需要的片刚刚被交换走
  - 局部性原理

- 硬件
  - 页表表项PTE ⭐
    - 用虚拟页号索引得到物理帧号，进而可以访问物理页
    - 项数：$2^{虚拟页号}$ 表项：$物理帧号+控制位$
    - 指明是否在主存中 （present/resident bit）
    - 一致性 modified/dirty bit
    - LRU标识位 最近是否访问 use/reference bit
    - ![image-20231227134408548](/blog/images/image-20231227134408548.png)
  - 特殊页表的PTE
    - 多级页表
    - 反向页表 
  - 页表问题
    - 空间 页表过大
      - 二级页表 只有根页表在主存 其他的在辐存
      - 反向页表 O(n)
    - 时间
      - TLB 也是MMU的一部分
        - 管理 
          - 硬件维护一个PTBR page table base register
          - 软件 缺页中断 => 查页表 更新TLB
        - 内容 `[VPN,PFN,other bits]` virtual page number, physics frame number
          - 回忆 普通页表没有VPN VPN是索引
          - 反转页表没有PFN PFN是索引
          - TLB是“关联式”的
        - 问题 进程切换时TLB怎么办
          - 添加标识位指明属于哪个进程
          - 进程切换时刷新 valid位全置0 这个方案效率很低
      - 对页表来说重要的参数
        - Page size
          - 越小 内部碎片越小
          - 越小 编号位越多 页表越大
          - 越大 越能和辅存交互（辅存是按块读取的）
          - 越小 局部性会提升
          - 越大 miss次数越小
          - 越大 TLB hit rate上升（一个表项对应的内存范围变大）
          - 通常设置为4kb
  
- 软件设计

  - 软件设计的核心是最小化缺页故障率

  - Fetch Policy 

    - 该读多少读多少 
    - preparing 多读一点 好处是利用了辅存的连续性

  - Placement policy 

    - 放哪里 前面讨论过了 最小外外部碎片 分段first最好 分页随便
    - 例外 NUMA[非一致存储访问多处理器] 访问时间和位置有关 就要设计

  - Replacement policy 满了替换谁

    - 有一些帧（内核、io buffer不会被替代）

    - 策略

      - optimal policy
        - 未来访问的块里时间最远的

      - LRU least recently used
        - 维护一个页号的链表
        - 计时
        - 矩阵做法 访问后对应行置为1 对应列置为0 行的值最小的就是最应该踢出去的

      - 近似的LRU
        - reference bit + 8bit
        - 首次进入置为1 访问时置为1
        - 每隔一段时间，右移一位

      - FIFO
        - 当做circular buffer 用轮转的方式替换
        - 问题
          - **belady's anomaly** 按理说应该分配的资源越多page fault越少，但是FIFO可能会资源越多，page fault越多
            - 不会发生这种错误的算法 stack algorithm
              - 分配m个帧的时候的驻留集是分配m+1个帧的子集 这样m+1的表现会至少比m个好
      - second chance
        - FIFO的修改版
        - 看最老的页面 use bit如果为0 就换掉
        - 如果为1 就置为0 相当于给了第2次机会
      - clock policy
        - 属于second-chance的一种实现
        - 从最老的开始轮着来，遇到的为1的全部清除，遇到第一个use bit为0的 替换
      - enhanced clock policy
        - 当使用情况差不多时，应该先替换没有被修改的
        - u0 m0 > u0 m1 > u1 m0 > u1 m1
        - 算法步骤
          - 第一遍扫描 找都为0的
          - 若没有 第二遍 找u0 m1 并且把每一个经过u置为0
          - 失败 回到步骤1
      - 看频率的 LFU MFU

  - page buffering

    - free frames
      - 替换modified page 的开销很大
      - 系统维护一个free frames池
      - 先把要换入的写入free frame中，在挪出这个dirty page  主要是节约时间

    - modified pages
    - a pool of free frames, but  to remember which page was in each frame.
      - 相当于一个页面级别的cache

    - 两个list 没有被修改的页面放到free frames，modified page放到modified frames list

  - Resident set management 驻留集管理

    - 对于一个进程而言 一开始增加资源时，缺页中断数会减少 到后面会趋于饱和

    - 分配策略

      - 固定分配策略
        - 发生缺页时，只会替换自己的辖区

      - 可变分配策略

    - 替换策略

      - 局部替换策略
      - 全局替换策略

    - 最好：可变分配+局部替换

      - 什么时候替换

        - 添加新进程，发生缺页故障时

        - 实时评估

          - 经常有缺页，说明小了

          - 基本不缺页 说明大了，可以把不常用的挪走

          - 引入一个阈值 F

            - 小于F：频繁 新加一页到驻留集

            - 大于F：不频繁 

              把所有use bit = 0 的都踢了 缩小驻留集 清空剩下的原本use bit = 1的use bit

    - 工作集

      - 一个进程当前正在使用的页面的集合
      - 如果一个页面不在工作集中，就可以被挪走
      - 用采样近似工作集
        - 固定的时间$\Delta$ 每隔$\Delta$ 就把所有的use bit置为0 每次采样的use bit = 1 的留下 =0 的全部踢了
      - 用频率 阈值 F
        - 问题 过渡区 在进程过渡区的时候 有一小段没有什么局部性，根据这个算法，会使得主流集变大很多
      - 采样可变的工作集
        - 解决局部性过渡问题
        - 引入三个参数
          - M 最小的采样时间
          - L 最大的采样时间
          - Q 采样间隙允许发生的page fault数量
        - 到了L的时候采样 扫描use bit 为0的全部踢了，1的全部变0
        - 如果到L之前已经发生了Q次缺页
          - 间隔时间小于M 到了M，扫描，踢了，清零
          - 间隔时间再M和L之间，直接扫描，踢了，清零
        - 总的来说，要么达到Q次，要么时间达到L 扫描一次
        - 为什么可以解决过渡区问题 没有加页 工作集不会扩到很大

  - Clean policy 写回怎么写

    - 只写dirty bit改了的
    - 全部写
    - 可以结合page buffering
  
  - load control
  
    - 工作集全部在内存中才可以运行，由此可以得到负载进程数
    - 意思是决定驻留的进程数
    - 页表错误太多就是thrashing
    - 发生thrashing 需要挂起一些进程
      - 低优先级、出错的、上一个activated、最小驻留集、内存最大的、最长剩余时间的
  
- os参与 

  - 创建进程
    - 创建页表
    - 用program text and data初始化swap area
      - swap area是用于放置虚拟页的地方 其他位置是文件系统

    - 把page table和swap area的信息放到进程表中

  - 当一个进程调度到开始执行时
    - 刷新MMU
    - 刷新TLB
    - 将进程页表拷贝到 页表基址寄存器
    - 有时会预先多调一些页面 fetch preparing

  - 发生page fault时
    - 找到需要的frame，驱逐旧的frame
    - 读新的frame
    - 让pc回到刚刚报错的指令 重新执行一遍

  - 进程终止
    - 释放页表，页，磁盘空间
    - 要注意共享空间 只能由最后一个占有的释放

## 文件

### 文件系统

- 文件

  - 文件是操作系统提供的对磁盘的一种封装
    - 分为 低字节流文件/结构化文件
  - 访问方式
    - 顺序访问
    - 直接访问 O(1)
- 目录

  - 分区

    - ![img](/blog/images/os_file.png)
    - MBR 磁盘启动块 
    - 磁盘会划分出很多分区，一个分区是一个文件系统
    - 分区内部有data和metadata（superblock中） freespace 是存储空闲位置的
    - inode 和文件一一对应 存储文件的描述信息，包括具体位置（占据了哪些磁盘块） 可以实现按名字访问
  - 目录 目录项是由`(文件名,inode)`组成的
  
    - 一个保存了文件名和文件本身映射关系的符号表
    - 目录结构
      - 树
      - 无环图
        - 实现文件共享
          - 硬链接 hard link
            - 用同一个inode inode增加link-count项
            - 不能指向目录 有成环地风险
            - 不能链接到其他分区 因为inode编号和当前分区是独立的
          - 软链接 symbolic link
            - 创建文件，存储链接到的文件的路径
            - 如果源文件删除，软链接仍然存在
            - 有较大的开销，可以跨分区，甚至可以跨电脑
  - 文件保护

    - 权限码 rwx
    - 访问控制
      - 用户，文件，权限类型
      - domain 对象和权限的二元组的集合
      - ![img](/blog/images/os_protect.png)
      - 很多都为空 所以退化成 
        - capability list 按行
        - Access control list 按列
  - 文件分配
  
    - 连续分配（预分配）
  
      - 起点、长度
      - 适合read-only的文件

    - 链式分配
  
      - 分块存储 用链表连起来
      - 缺点 访问是顺序访问 O(n)
        - 为了加速 需要把空的块合并到一起
        - 指针占磁盘空间
        - 不可靠 中间一个指针丢失 后面的都会丢掉
          - 解决 反向、双向
  
    - FAT 优化的链式分配
  
      - 分区开始一张表 存储链表的链 当前块号为索引 可以查到下一块的块号
      - 还是要查n次

    - 索引分配 inode就是这种
  
      - 在文件控制块 FCB中设置一个区域，成为索引块或索引表，存储指向文件各个块的指针
  
        - 太大了 间接指针，多级指针
  - 空闲管理
    - 位表
      - 1对应的块表示空闲
    - 链表
      - 用一个指针指向空闲块 空闲块彼此链起来
    - grouping
      - 把所有空闲块的指针全部放到一个块里 
      - 缺点 每次都要操作这个块 很麻烦
  - 一致性
    - 块一致性
      - 两个表 一个表示在文件中出现几次 一个表示在空表中出现几次
      - 加起来应该全部为1
      - 两个表都没有
        - miss 加到空表里
      - 多次判空
        - 重新处理空表
      - 被分给多个文件
        - 找一个空页承接其中一个
    - 文件一致性
      - 检查父节点个数是否与link count一致
  - Unix管理
    - inode 13=10+1+1+1
      - 一共 $10 + 256 +256^2+256^3$

### I/O设备

- layout
  - memory-mapped I/O
    - 在内存上分配一块地方放io 对io的访问转化为对内存的读写
  - 实现IO
    - 系统调用
      - 直接做 忙等
      - 异步执行 中断驱动
      - dma 批量的io 直接做 不用经过cpu
  - device driver
    - 一层封装 是kernel的一部分 直接控制设备的寄存器
  - 设备无关软件
    - 提供所有设备都需要的功能，封装底层driver为interface 在driver和用户之间
    - 统一接口
    - 保护io
    - 报告错误
    - 分配、释放device 
    - 统一磁盘空间
  - 用户层
    - 库
    - 伪脱机 用磁盘做缓冲
- buffer
  - 提前读 滞后写
  - 单缓冲区
    - ![img](/blog/images/1702534239833-df8f879e-bf5a-4755-a17c-8a6145dddb47.png)
    - 平均 $max(C,T)+M$ 所有的+$C_n$
  - 双缓冲区 缓冲区可以直接映射到data，不用move
    - 平均 $max(T,C)$ 总$T_1+C_{10}+10\times max(T,C)$
  - 循环缓冲 多一些buffer
  - 可以看成一种生产者消费者，如果是input，用户是生产者
  - 意义
    - 解决速度不匹配
    - 解决设备块大小不匹配的问题
    - 实现拷贝语义 先复制到buffer 可以保存下那个时刻的值
  - 伪脱机
    - 捕捉到需要缓存的数据，放到磁盘上
    - 开启一个后台运行的守护进程
- 磁盘
  - 数据组织
    - ![img](/blog/images/os_disk.png)
    - 盘片 磁道 柱面 扇区 
  - 读写过程
    - 磁头径向伸缩 定位到磁道 寻道时间
    - 旋转盘片 一般算1/2整圈时间
    - 数据传输 扇区旋转一个section 的时间 优化一般==最小化寻道时间==
  - 磁盘调度 先寻哪个道
    - 先来先服务 FIFO
    - priority
      - 最短时间寻道优先 SSTF
        - 哪个近去哪个 可能会左右横跳
    - scan/look
      - scan是达到最后一个 look是没有更多请求
    - c-scan
      - 单项扫描 返回途中不处理io请求
      - 相较于scan，最小化最大等待时间
      - 对scan 最多2*磁道 c-scan 一趟扫描+一次返回
    - 问题 粘滞性 长期地位于同一个磁道上
      - N-step-Scan
        - 有请求队列 一次扫描只处理N个请求
        - n=1 fifo
      - FSCAN
        - 两个队列 一个处理请求 一个接收请求
    - ![img](/blog/images/os_disk_sche.png)