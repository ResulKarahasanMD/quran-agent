'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CHAT_EXAMPLES } from '@/lib/chat-examples';
import type { AgentResponse } from '@/types/acikkuran';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  response?: AgentResponse;
  error?: string;
  loading?: boolean;
}

interface ChatInterfaceProps {
  onResponse?: (response: AgentResponse) => void;
  language: 'tr' | 'en';
}

export function ChatInterface({ onResponse, language }: ChatInterfaceProps) {
  const t = useTranslations('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const examples = CHAT_EXAMPLES[language];

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollEl = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    }
  }, [messages]);

  const submitQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
      };

      const loadingId = (Date.now() + 1).toString();
      const loadingMessage: Message = {
        id: loadingId,
        role: 'assistant',
        content: '',
        loading: true,
      };

      setMessages(prev => [...prev, userMessage, loadingMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: trimmed, language }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setMessages(prev =>
            prev.map(m =>
              m.id === loadingId
                ? { ...m, loading: false, error: data.error ?? t('error') }
                : m
            )
          );
        } else {
          const response = data as AgentResponse & { success: boolean };
          setMessages(prev =>
            prev.map(m =>
              m.id === loadingId
                ? { ...m, loading: false, content: trimmed, response }
                : m
            )
          );
          onResponse?.(response);
        }
      } catch {
        setMessages(prev =>
          prev.map(m =>
            m.id === loadingId
              ? { ...m, loading: false, error: t('error') }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading, language, onResponse, t]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitQuestion(input);
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
    void submitQuestion(query);
  };

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="h-64 rounded-md border" ref={scrollAreaRef}>
        <div className="flex flex-col gap-3 p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              {t('empty')}
            </p>
          )}
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.loading ? (
                <Card className="max-w-[80%]">
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ) : message.error ? (
                <Card className="max-w-[80%] border-destructive">
                  <CardContent className="p-3">
                    <p className="text-sm text-destructive">{message.error}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className={`max-w-[80%] ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">
                      {message.role === 'user' ? message.content : ''}
                      {message.role === 'assistant' && message.response && (
                        <span className="block text-xs text-muted-foreground">
                          ✓ {t('connectionsFound', { count: message.response.connections?.length ?? 0 })}
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">{t('examplesLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {examples.map(example => (
            <Badge
              key={example.query}
              variant="outline"
              render={
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleExampleClick(example.query)}
                  className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
              }
            >
              {example.label}
            </Badge>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('placeholder')}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? t('loading') : t('submit')}
        </Button>
      </form>
    </div>
  );
}
