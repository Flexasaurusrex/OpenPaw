package ai.openpaw.android.ui

import androidx.compose.runtime.Composable
import ai.openpaw.android.MainViewModel
import ai.openpaw.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
