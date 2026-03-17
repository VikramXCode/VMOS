import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import App from "./App.tsx";
import "./index.css";
import { BookingProvider } from "@/contexts/BookingContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { PublicContentProvider } from "@/contexts/PublicContentContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<PublicContentProvider>
				<BookingProvider>
					<CartProvider>
						<AdminProvider>
							<TooltipProvider>
								<App />
								<Toaster />
								<Sonner />
							</TooltipProvider>
						</AdminProvider>
					</CartProvider>
				</BookingProvider>
			</PublicContentProvider>
		</QueryClientProvider>
	</BrowserRouter>
);
