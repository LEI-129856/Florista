(function(){
            const ease = t => t<0.5 ? 2*t*t : -1 + (4-2*t)*t;
            const getOffset = ()=>{ const h=document.querySelector('.header'); if(!h) return 0; const top=parseFloat(getComputedStyle(h).top)||0; return Math.ceil(h.offsetHeight+top+8); };
            let headerOffset = getOffset();
            window.addEventListener('resize', ()=> headerOffset = getOffset());

            document.addEventListener('click', function(e){
                const a = e.target.closest('a[href^="#"]'); if(!a) return;
                const href = a.getAttribute('href'); if(!href||href==='#') return;
                const target = document.querySelector(href); if(!target) return;
                e.preventDefault();
                const start = window.pageYOffset;
                const end = start + target.getBoundingClientRect().top - headerOffset;
                const duration = 900;
                let t0 = null;
                function step(ts){ if(!t0) t0 = ts; const time = ts - t0; const p = Math.min(1, time / duration); window.scrollTo(0, Math.round(start + (end - start) * ease(p))); if(time < duration) requestAnimationFrame(step); }
                requestAnimationFrame(step);
                history.pushState(null, '', href);
            }, {passive:false});
        })();

        let totalItens = 0;
        let carrinho = [];

        function atualizarCarrinho() {
            const badge = document.getElementById('cart-badge');
            if (badge) {
                badge.textContent = totalItens;
            }

            const lista = document.getElementById('cart-items-list');
            const totalPreco = document.getElementById('cart-total-price');

            if (!lista) return;

            if (carrinho.length === 0) {
                lista.innerHTML = '<p class="empty-cart">O teu carrinho está vazio.</p>';
                if (totalPreco) totalPreco.textContent = '0,00 €';
                return;
            }

            let total = 0;
            lista.innerHTML = carrinho.map((item, index) => {
                total += item.preco;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <strong>${item.nome}</strong>
                            <span>${item.preco.toFixed(2).replace('.', ',')} €</span>
                        </div>
                        <button class="cart-item-remove" onclick="removerDoCarrinho(${index})">Remover</button>
                    </div>
                `;
            }).join('');

            if (totalPreco) {
                totalPreco.textContent = `${total.toFixed(2).replace('.', ',')} €`;
            }
        }

        function adicionarAoCarrinho(button) {
            const flowerDiv = button.closest('.Flower_div');
            if (!flowerDiv) return;

            const nome = flowerDiv.querySelector('.flower_name')?.textContent.trim() || 'Produto';
            const precoTexto = flowerDiv.querySelector('.flower_price')?.textContent || '';
            const precoNumerico = Number(precoTexto.replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;

            carrinho.push({ nome, preco: precoNumerico });
            totalItens = carrinho.length;
            atualizarCarrinho();
            abrirCarrinho();
        }

        function removerDoCarrinho(index) {
            carrinho.splice(index, 1);
            totalItens = carrinho.length;
            atualizarCarrinho();
        }

        function abrirCarrinho() {
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) cartModal.classList.add('ativo');
        }

        function fecharCarrinho() {
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) cartModal.classList.remove('ativo');
        }

        function limparCarrinho() {
            carrinho = [];
            totalItens = 0;
            atualizarCarrinho();
        }

        function confirmarCompra() {
            if (carrinho.length === 0) {
                alert('O teu carrinho está vazio.');
                return;
            }

            const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
            alert(`Compra confirmada! Total: ${total.toFixed(2).replace('.', ',')} €`);
            limparCarrinho();
            fecharCarrinho();
        }

        //-- Funções para Política de Privacidade Modal -->
        function abrirPrivacidade() {
            document.getElementById('privacy-modal').classList.add('ativo');
        }

        function fecharPrivacidade() {
            document.getElementById('privacy-modal').classList.remove('ativo');
        }

        // Fechar modal clicando fora do conteúdo
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('privacy-modal');
            if (event.target === modal) {
                fecharPrivacidade();
            }

            const cartModal = document.getElementById('cart-modal');
            if (event.target === cartModal) {
                fecharCarrinho();
            }
        });

        // Fechar modal ao pressionar ESC
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                fecharPrivacidade();
                fecharCarrinho();
            }
        });