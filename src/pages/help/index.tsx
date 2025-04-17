
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Centro de Ajuda</h1>
      
      <div className="mb-8">
        <div className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Pesquisar tópicos de ajuda..." 
              className="pl-10"
            />
          </div>
          <Button>Buscar</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como adicionar um novo paciente?</AccordionTrigger>
                  <AccordionContent>
                    Para adicionar um novo paciente, navegue até a página "Pacientes" no menu lateral 
                    e clique no botão "Adicionar Paciente". Preencha o formulário com as informações
                    necessárias e clique em "Salvar".
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Como criar uma nova playlist de músicas?</AccordionTrigger>
                  <AccordionContent>
                    Para criar uma nova playlist, acesse a página "Musicoterapia TEA" no menu lateral. 
                    Na seção de playlists, clique em "Nova Playlist", dê um nome e comece a adicionar 
                    músicas da biblioteca ou fazendo upload de novos arquivos.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como gerar relatórios de evolução?</AccordionTrigger>
                  <AccordionContent>
                    Para gerar relatórios de evolução, acesse a página "Processos" no menu lateral,
                    selecione o paciente desejado e clique em "Relatórios". Escolha o tipo de relatório
                    que deseja gerar, preencha as informações necessárias e clique em "Gerar PDF".
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Como alterar minha senha?</AccordionTrigger>
                  <AccordionContent>
                    Para alterar sua senha, acesse a página "Perfil" no menu lateral, role até a 
                    seção "Segurança" e clique em "Alterar Senha". Você precisará informar sua senha 
                    atual e a nova senha duas vezes para confirmação.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Não encontrou o que procurava? Entre em contato com nossa equipe de suporte.
              </p>
              
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">suporte@musetera.com</p>
              </div>
              
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-muted-foreground">(11) 3456-7890</p>
              </div>
              
              <Button className="w-full">Enviar mensagem</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
