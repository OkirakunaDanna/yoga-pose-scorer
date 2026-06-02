# LuaLaTeX で PDF を生成
# 必要: LuaLaTeX, ltjsclasses (または luatexja), 日本語フォント

LATEX = lualatex
TARGETS = 仕様書.pdf 操作説明書.pdf

.PHONY: all clean

all: $(TARGETS)

%.pdf: %.tex common.tex
	$(LATEX) -interaction=nonstopmode -halt-on-error $<
	$(LATEX) -interaction=nonstopmode -halt-on-error $<

clean:
	rm -f *.aux *.log *.out *.toc *.pdf
