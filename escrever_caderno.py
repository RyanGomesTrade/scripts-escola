from PIL import Image, ImageDraw, ImageFont
import textwrap

def escrever_na_folha(caminho_imagem, texto, caminho_fonte, caminho_saida):
    try:
        # 1. Abre a imagem do caderno em branco
        imagem = Image.open(caminho_imagem)
        desenhar = ImageDraw.Draw(imagem)
        
        # 2. Configurações da Fonte
        tamanho_fonte = 35 # Ajuste conforme o tamanho da sua imagem
        fonte = ImageFont.truetype(caminho_fonte, tamanho_fonte)
        
        # 3. Configurações de Posição (Você precisará ajustar esses valores testando na sua foto)
        margem_esquerda = 80    # Distância da borda esquerda até começar a escrever (em pixels)
        posicao_y = 130          # Distância do topo até a primeira linha (em pixels)
        espacamento_linha = 40   # Distância entre uma linha e outra (para encaixar na pauta do caderno)
        caracteres_por_linha = 55 # Quantidade de letras antes de pular de linha
        
        # Cor da "caneta" no formato RGB (aqui está um azul escuro de caneta esferográfica)
        cor_caneta = (15, 30, 120) 

        # 4. Processamento do Texto
        # Divide o texto em parágrafos para respeitar as quebras de linha originais
        paragrafos = texto.split('\n')
        
        for paragrafo in paragrafos:
            # Pula linhas vazias
            if not paragrafo.strip():
                posicao_y += espacamento_linha
                continue
                
            # Quebra o parágrafo em linhas menores para caber na folha
            linhas_quebradas = textwrap.wrap(paragrafo, width=caracteres_por_linha)
            
            # Adiciona o recuo (parágrafo) na primeira linha
            linhas_quebradas[0] = "      " + linhas_quebradas[0] 
            
            for linha in linhas_quebradas:
                # Desenha o texto na imagem
                desenhar.text((margem_esquerda, posicao_y), linha, font=fonte, fill=cor_caneta)
                
                # Desce para a próxima linha do caderno
                posicao_y += espacamento_linha
                
        # 5. Salva a imagem final
        imagem.save(caminho_saida)
        print(f"Sucesso! Sua redação foi salva em: {caminho_saida}")
        
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

# ==========================================
# COMO USAR O SCRIPT
# ==========================================

# Cole sua redação aqui dentro das três aspas
minha_redacao = """Ryan Gomes, 3A:
 A obra “1984”, de George Orwell, retrata uma sociedade marcada pelo controle e pela manipulação das condições de vida dos indivíduos, limitando suas perspectivas de futuro. Fora da ficção, no Brasil contemporâneo, muitos jovens enfrentam uma realidade igualmente restritiva no mercado de trabalho, marcada pela precarização e pela falta de oportunidades dignas. Nesse contexto, a baixa qualificação profissional e a informalidade estrutural configuram-se como fatores centrais que comprometem a inserção e a ascensão juvenil no mundo laboral.

Em primeira análise, é importante destacar que a insuficiente qualificação dos jovens brasileiros contribui diretamente para sua inserção em empregos precários. Conforme apontado nos textos motivadores, grande parte das ocupações que concentram trabalhadores entre 18 e 29 anos exige pouca especialização, o que atrai indivíduos que não tiveram acesso adequado à educação formal ou técnica. Dessa forma, cria-se um ciclo vicioso: a falta de formação limita o acesso a melhores oportunidades, enquanto os empregos disponíveis não oferecem condições para o desenvolvimento profissional. Assim, perpetua-se a vulnerabilidade dessa parcela da população, dificultando a construção de carreiras estáveis.

Ademais, a alta taxa de informalidade agrava ainda mais esse cenário. Dados indicam que cerca de 40% dos jovens ocupados estão inseridos em trabalhos informais, o que evidencia a precariedade das relações de trabalho no país. Nesse sentido, a ausência de direitos trabalhistas, como férias remuneradas e previdência social, compromete não apenas a segurança financeira imediata, mas também o futuro desses trabalhadores. Paralelamente, a concorrência com profissionais mais experientes e a rejeição a empregos formais mal remunerados — vistos como desgastantes e pouco atrativos — reforçam a instabilidade enfrentada pelos jovens, que, muitas vezes, optam por alternativas igualmente inseguras, como o trabalho autônomo sem garantias.

Portanto, torna-se evidente que a precarização do trabalho juvenil no Brasil decorre de fatores estruturais que exigem intervenções efetivas. Para mitigar esse problema, cabe ao Ministério da Educação, em parceria com o Ministério do Trabalho, ampliar o acesso a cursos técnicos e programas de qualificação profissional, por meio da criação de políticas públicas voltadas à capacitação gratuita e de qualidade para jovens de baixa renda. Além disso, o governo federal deve incentivar a formalização do trabalho juvenil, mediante a concessão de benefícios fiscais às empresas que contratarem jovens em regime CLT, garantindo direitos e estabilidade. Com isso, será possível promover melhores condições de inserção no mercado de trabalho e assegurar perspectivas mais promissoras para a juventude brasileira."""

# Substitua pelos nomes dos seus arquivos reais
IMAGEM_CADERNO = "caderno_vazio.jpg"  
ARQUIVO_FONTE = "IndieFlower-Regular.ttf" # Nome do arquivo de fonte que você baixou
IMAGEM_PRONTA = "redacao_final.jpg"

# Executa a função
escrever_na_folha(IMAGEM_CADERNO, minha_redacao, ARQUIVO_FONTE, IMAGEM_PRONTA)