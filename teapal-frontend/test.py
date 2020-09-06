import re



# regular-rxpression
# number of parameters
# constructor
md_patterns = []

# 最先匹配与换行操作有关的格式

# h1_pattern = re.compile(r'#((?!#).)(.*?)')
h1_pattern = re.compile(r'\n#([^#].*)')
def H1 (params): content = params; return {'label':'h1','content':content}
md_patterns.append([h1_pattern,1,H1,True])

# H2_pattern = re.compile(r'##((?!#).)(.*?)')
h2_pattern = re.compile(r'\n##([^#].*)')
def H2 (params): content = params; return {'label':'h2','content':content}
md_patterns.append([h2_pattern,1,H2,True])

# H3_pattern = re.compile(r'###((?!#).)(.*?)')
h3_pattern = re.compile(r'\n###([^#].*)')
def H3 (params): content = params; return {'label':'h3','content':content}
md_patterns.append([h3_pattern,1,H3,True])

# H4_pattern = re.compile(r'####((?!#).)(.*?)')
h4_pattern = re.compile(r'\n####([^#].*)')
def H4 (params): content = params; return {'label':'h4','content':content}
md_patterns.append([h4_pattern,1,H4,True])

# H5_pattern = re.compile(r'#####((?!#).)(.*?)')
h5_pattern = re.compile(r'\n#####([^#].*)')
def H5 (params): content = params; return {'label':'h5','content':content}
md_patterns.append([h5_pattern,1,H5,True])

# H6_pattern = re.compile(r'######((?!#).)(.*?)')
h6_pattern = re.compile(r'\n######([^#].*)')
def H6 (params): content = params; return {'label':'h6','content':content}
md_patterns.append([h6_pattern,1,H6,True])

#seperate_pattern = re.compile('(\\*|\\+|\\_){3}')
seperate_pattern = re.compile(r'\n-{3,}')
def Sep (params): return {'label':'sep'}
md_patterns.append([seperate_pattern,0,Sep,True])

# 匹配段落和换行

p_pattern = re.compile(r'\n(.+?)\n')
def P (params): content = params; return {'label':'p','content':content}
md_patterns.append([p_pattern,1,P,True])

br_pattern = re.compile(r'\n')
def Br (params): return {'label':'br'}
md_patterns.append([br_pattern,0,Br,False])

# 接下来的内容都是可以插入到段落中的

#image_pattern = re.compile(r'!\[.*?\]\((.*?)\)|<img.*?src=[\'\"](.*?)[\'\"].*?>')
#image_url_pattern = re.compile(r'\!\[.*?\][(](.*?)[)]')
img_pattern = re.compile(r'\!\[(.*?)\]\((.*?)\)')
def Img (params): alt, src = params; return {'label':'img','alt':alt,'src':src}
md_patterns.append([img_pattern,2,Img,False])

# a_pattern = re.compile('\[[\s\S]*?\]\([\s\S]*?\)')
a_pattern = re.compile(r'\[(.*?)\]\((.*?)\)')
def A (params): content, href = params; return {'label':'a','content':content,'href':href}
md_patterns.append([a_pattern,2,A,False])

#large_code_pattern = re.compile('```([\\s\\S]*?)```[\\s]?')
large_code_pattern = re.compile(r'```(.*?)```[\\s]?')







smallcode_pattern = re.compile('`{1,2}[^`](.*?)`{1,2}')
delete_pattern = re.compile('\\~\\~(.*?)\\~\\~')
italic_pattern = re.compile('(\\*|_)((?!\\*).)(.*?)((?!\\*).)\\1')
bold_pattern = re.compile('(\\*\\*|_\_)((?!\\*).)(.*?)((?!\\*).)\\1')
bold_italic_pattern = re.compile('(\\*\\*\\*|_\_\_)((?!\\*).)(.*?)((?!\\*).)\\1')
quote_pattern = re.compile('((&gt;|\\>)+)(.*)')

order_list_pattern = re.compile('^[\\s]*[0-9]+\\. (.*)')
unorder_list_pattern = re.compile('^[\\s]*[-\\*|\\+]+ (.*)')
alt_pattern = re.compile(r'\![\[](.*?)[\]]\(.*?\)')


# document: list of strings and nodes
# patterns: list of dictionaries like {'re':img_pattern,'cnt':2,'con':Img}
def convert ( document, patterns ):
    for i in range(len(document)):
        part = document[i] # part: string or node
        if type(part)==str:

            for pattern in patterns:
                regular, param_cnt, constructor, add_br = pattern
                match = re.search(regular, part) # match: Match object
                #else: match = re.search(regular, part['content'])
                
                if match != None: # 如果找到了一种格式，将此符合格式的字符串转化节点，并继续迭代前后两部分
                    start, end = match.span()
                    #if type(part)==str: 
                    before_str = part[:start]
                    after_str = part[end:]
                    if part[end-1]=='\n' and start+1<end and add_br: after_str='\n'+after_str
                    before_doc = convert([before_str], patterns)
                    after_doc = convert([after_str], patterns)
                    #else:
                    #    print("Match P"+part['content']+" with",constructor)
                    #    before_doc = convert([part['content'][:start]], patterns)
                    #    after_doc = convert([part['content'][end:]], patterns)
                    
                    params = []
                    if param_cnt>0:
                        for i in range(param_cnt):
                            params.append(match.group(i+1))
                    node = constructor(params)

                    if node['label']=='p':node_doc = convert([node],patterns)
                    elif node['label']=='img':node_doc = [{'label': 'br'},node] # 图片自动加br，可以取消掉
                    else: node_doc = [node]

                    document = document[:i-1] + before_doc + node_doc + after_doc + document[i+1:]
                    break
                else: pass
            else:
                if part=='': document.pop(i)
                else: document[i] = part # 如果在字符串中未匹配到任何格式，返回普通文字
        elif part['label']in['p','h1','h2','h3','h4','h5','h6']:
            new_patterns = [pattern for pattern in patterns if pattern[2]!=P and pattern[2]!=Br]
            part['content'] = convert(part['content'],new_patterns)
        else:
            document[i] = document[i] # do nothing
    return document

# main
text ="""###标#题
##二级标题feqjbfj##假的二级标题等方面表现卓越的优秀学生代表，为在校生树立学习的模范。
阿抢到了[校园文化建设](http://aaaa.com)王淇你

![image_111.jpg](http://ciwk-1301216399.cos.ap-guangzhou.myqcloud.com/post-img-1596698169112)balabala

```
long code
```

-------
#jhdojchoanocns”

![image_222.jpg](http://ciwk-1301216399.cos.ap-guangzhou.myqcloud.com/post-img-1596698169112)
"""
document = ['\n'+text]
result = convert(document, md_patterns)
#print(text)
for node in result:
    print(node)




