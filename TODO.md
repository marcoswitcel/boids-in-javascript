# Lista de pendências

# Planejamento

A ideia é realizar uma implementação de boids baseada no conteúdo contigo aqui: [https://natureofcode.com/book/chapter-6-autonomous-agents/#613-flocking](https://natureofcode.com/book/chapter-6-autonomous-agents/#613-flocking). Possivelmente buscar mais embasamentos, porém não divagar muito, o exemplo contigo no site é suficientemente bom para a próxima etapa.
A próxima etapa seria otimizar a simulação incluindo um hash espacial.


# Feature

* simular boids
* implementar um hash espacial para otimizar a simulação e maximizar o número de boids sem o uso de threads, webassembly ou webgl ou webgpu
* possivelmente experimentar com um conceito de buffer de posições para maximizar a velocidade de update dos elementos, caso se mostre positivo o efeito, aí sim pensar em implementar um renderizador webgl ou afim
